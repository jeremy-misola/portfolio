package service

import (
	"k8s.io/client-go/kubernetes"
)

type MonitoringStateServiceImpl struct{}

func NewMonitoringService(kubeClient *kubernetes.Clientset) *MonitoringStateServiceImpl {
	return &MonitoringStateServiceImpl{}
}

func SayHello() string {
	return "test"
}
