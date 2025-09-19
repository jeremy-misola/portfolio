package service

import (
	"net/http"

	"k8s.io/client-go/kubernetes"
)

type MonitoringServiceImpl struct {
	kubeClient *kubernetes.Clientset
}

func NewMonitoringService(kubeClient *kubernetes.Clientset) *MonitoringServiceImpl {
	return &MonitoringServiceImpl{
		kubeClient: kubeClient,
	}
}

func (s *MonitoringServiceImpl) SayHello() string {
	return "test"
}

func (s *MonitoringServiceImpl) GetTrafficDistribution() (map[string]interface{}, error) {
	url := "http://prometheus-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090/api/v1/query?query=apiserver_request_total"
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return nil, nil
}
