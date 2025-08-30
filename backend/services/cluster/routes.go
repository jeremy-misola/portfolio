package cluster

import (
	"backend/types"
	"backend/utils"
	"context"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type Handler struct {
	clientset *kubernetes.Clientset
}

func NewHandler(clientset *kubernetes.Clientset) *Handler {
	return &Handler{
		clientset: clientset,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/cluster/state", h.handleClusterState).Methods("GET")
}

func (h *Handler) handleClusterState(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hello")

	// Get Server Version
	serverVersion, err := h.clientset.Discovery().ServerVersion()
	if err != nil {
		utils.WriteError(w, 500, err)
		return
	}

	// Get Pods
	pods, err := h.clientset.CoreV1().Pods("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		utils.WriteError(w, 500, err)
		return
	}

	var podList []types.Pod
	for _, pod := range pods.Items {
		podList = append(podList, types.Pod{
			Name:         pod.Name,
			Node:         pod.Spec.NodeName,
			Status:       string(pod.Status.Phase),
			DeploymentID: "test",
		})
	}

	// Get Nodes
	nodes, err := h.clientset.CoreV1().Nodes().List(r.Context(), metav1.ListOptions{})
	if err != nil {
		utils.WriteError(w, 500, err)
		return
	}

	var nodeList []types.Node
	for _, node := range nodes.Items {
		nodeList = append(nodeList, types.Node{
			Name:   node.Name,
			Status: string(node.Status.Phase),
		})
	}

	// Get Deployments
	deployments, err := h.clientset.AppsV1().Deployments("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		utils.WriteError(w, 500, err)
		return
	}

	var deploymentList []types.Deployment
	for _, deployment := range deployments.Items {
		deploymentList = append(deploymentList, types.Deployment{
			ID:   string(deployment.UID),
			Name: deployment.Name,
			Replicas: types.Replica{
				Desired: int(*deployment.Spec.Replicas),
				Ready:   int(deployment.Status.ReadyReplicas),
			},
			Image: deployment.Spec.Template.Spec.Containers[0].Image,
		})
	}

	services, err := h.clientset.CoreV1().Services("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		utils.WriteError(w, 500, err)
		return
	}

	var serviceList []types.Service
	for _, service := range services.Items {
		serviceList = append(serviceList, types.Service{
			ID:           string(service.UID),
			Name:         service.Name,
			Type:         string(service.Spec.Type),
			ClusterIP:    service.Spec.ClusterIP,
			Ports:        "test",
			DeploymentID: "test",
		})
	}
	ingresses, err := h.clientset.NetworkingV1().Ingresses("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		utils.WriteError(w, 500, err)
		return
	}

	var ingressList []types.Ingress
	for _, ingress := range ingresses.Items {
		var host string
		if len(ingress.Spec.Rules) > 0 {
			host = ingress.Spec.Rules[0].Host
		}

		var tls bool
		if len(ingress.Spec.TLS) > 0 {
			tls = true
		}

		ingressList = append(ingressList, types.Ingress{
			ID:        string(ingress.UID),
			Name:      ingress.Name,
			Host:      host,
			TLS:       tls,
			ServiceID: "test", // You would need logic to determine the backend service
		})
	}

	response := types.ClusterStateResponse{
		ServerVersion: serverVersion.String(),
		Nodes:         nodeList,
		Deployments:   deploymentList,
		Pods:          podList,
		Services:      serviceList,
		Ingresses:     ingressList,
		ActivePod:     "test",
	}

	utils.WriteJSON(w, 200, response)

}
