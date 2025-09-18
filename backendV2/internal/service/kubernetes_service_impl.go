package service

import (
	"backendV2/model"
	"context"

	"github.com/gin-gonic/gin"

	v1 "k8s.io/api/apps/v1"
	network "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"
)

type ClusterStateRetriever interface {
	GetServerVersion() (string, error)
	GetNodes() ([]model.Node, error)
	GetDeployments() ([]model.Deployment, error)
	GetPods() ([]model.Pod, error)
	GetServices() ([]model.Service, error)
	GetIngresses() ([]model.Ingress, error)
}

type ClusterStateRetrieverImpl struct {
	clientset *kubernetes.Clientset
}

func NewKubernetesService(kubeClient *kubernetes.Clientset) *ClusterStateRetrieverImpl {
	return &ClusterStateRetrieverImpl{
		clientset: kubeClient,
	}
}

func (s *ClusterStateRetrieverImpl) retrieveDeploymentObjectList() (*v1.DeploymentList, error) {
	deployments, err := s.clientset.AppsV1().Deployments("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	return deployments, nil
}

func (s *ClusterStateRetrieverImpl) retrieveServiceObjectList() (*network.ServiceList, error) {
	services, err := s.clientset.CoreV1().Services("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	return services, nil
}

func (s *ClusterStateRetrieverImpl) GetServerVersion() (string, error) {
	serverVersion, err := s.clientset.Discovery().ServerVersion()
	return serverVersion.String(), err
}

func (s *ClusterStateRetrieverImpl) GetNodes() ([]model.Node, error) {
	nodes, err := s.clientset.CoreV1().Nodes().List(&gin.Context{}, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	var nodeList []model.Node
	for _, node := range nodes.Items {
		nodeList = append(nodeList, model.Node{
			Name:   node.Name,
			Status: string(node.Status.Phase),
		})
	}
	return nodeList, err
}

func (s *ClusterStateRetrieverImpl) GetDeployments() ([]model.Deployment, error) {
	deployments, err := s.retrieveDeploymentObjectList()

	var deploymentList []model.Deployment
	for _, deployment := range deployments.Items {
		deploymentList = append(deploymentList, model.Deployment{
			ID:   string(deployment.UID),
			Name: deployment.Name,
			Replicas: model.Replica{
				Desired: int(*deployment.Spec.Replicas),
				Ready:   int(deployment.Status.ReadyReplicas),
			},
			Image: deployment.Spec.Template.Spec.Containers[0].Image,
		})
	}

	return deploymentList, err
}

func (s *ClusterStateRetrieverImpl) GetPods() ([]model.Pod, error) {
	pods, err := s.clientset.CoreV1().Pods("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	var podList []model.Pod
	for _, pod := range pods.Items {
		var deploymentName string
		owner := metav1.GetControllerOf(&pod)
		if owner != nil {
			if owner.Kind == "ReplicaSet" {
				replicaSet, _ := h.clientset.AppsV1().ReplicaSets(pod.Namespace).Get(&gin.Context{}, owner.Name, metav1.GetOptions{})
				rsOwner := metav1.GetControllerOf(replicaSet)
				deploymentName = string(rsOwner.UID)
			}
		}

		podList = append(podList, model.Pod{
			Name:         pod.Name,
			Node:         pod.Spec.NodeName,
			Status:       string(pod.Status.Phase),
			DeploymentID: deploymentName,
		})
	}
	return podList, err
}

func (s *ClusterStateRetrieverImpl) GetServices() ([]model.Service, error) {
	deployments, _ := s.retrieveDeploymentObjectList()
	services, err := s.clientset.CoreV1().Services("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	var serviceList []model.Service
	for _, service := range services.Items {
		var deploymentName string
		selector := service.Spec.Selector
		if len(selector) == 0 {
			continue
		}

		for _, deployment := range deployments.Items {
			if deployment.Spec.Selector != nil {
				deploymentSelector := labels.Set(deployment.Spec.Selector.MatchLabels).AsSelector()
				if deploymentSelector.Matches(labels.Set(selector)) {
					deploymentName = string(deployment.UID)
				}
			}
		}

		serviceList = append(serviceList, model.Service{
			Name:         service.Name,
			Type:         string(service.Spec.Type),
			ClusterIP:    service.Spec.ClusterIP,
			Ports:        "8080/TCP",
			DeploymentID: deploymentName,
		})
	}
	return serviceList, nil
}

func (s *ClusterStateRetrieverImpl) GetIngresses() ([]model.Ingress, error) {
	services, err := s.retrieveServiceObjectList()
	ingresses, err := s.clientset.NetworkingV1().Ingresses("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}
	var ingressList []model.Ingress

	for _, ingress := range ingresses.Items {

		var serviceID string

		rule := ingress.Spec.Rules[0].HTTP.Paths[0].Backend.Service.Name

		for _, service := range services.Items {
			if service.Name == rule {
				serviceID = rule
			}
		}
		var host string
		if len(ingress.Spec.Rules) > 0 {
			host = ingress.Spec.Rules[0].Host
		}

		var tls bool
		if len(ingress.Spec.TLS) > 0 {
			tls = true
		}

		ingressList = append(ingressList, model.Ingress{
			Name:      ingress.Name,
			Host:      host,
			TLS:       tls,
			ServiceID: serviceID,
		})
	}
	return ingressList, nil
}
