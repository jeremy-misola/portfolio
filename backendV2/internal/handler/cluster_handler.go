package handler

import (
	"backendV2/internal/utils"
	"backendV2/model"

	"github.com/gin-gonic/gin"
)

type ClusterHandler struct {
	clusterStateRetriever ClusterStateRetriever
}

type ClusterStateRetriever interface {
	GetServerVersion() (string, error)
	GetNodes() ([]model.Node, error)
	GetDeployments() ([]model.Deployment, error)
	GetPods() ([]model.Pod, error)
	GetServices() ([]model.Service, error)
	GetIngresses() ([]model.Ingress, error)
}

func NewKubernetesHandler(ClusterStateRetriever ClusterStateRetriever) *ClusterHandler {
	return &ClusterHandler{
		clusterStateRetriever: ClusterStateRetriever,
	}
}

func (h *ClusterHandler) GetClusterState(c *gin.Context) {
	serverVersion, err := h.clusterStateRetriever.GetServerVersion()
	if err != nil {
		utils.WriteError(c, 500, err)
		return
	}

	podList, err := h.clusterStateRetriever.GetPods()
	if err != nil {
		utils.WriteJSON(c, 500, err)
		return
	}
	nodeList, err := h.clusterStateRetriever.GetNodes()
	if err != nil {
		utils.WriteError(c, 500, err)
		return
	}

	deploymentList, err := h.clusterStateRetriever.GetDeployments()
	if err != nil {
		utils.WriteError(c, 500, err)
		return
	}

	serviceList, err := h.clusterStateRetriever.GetServices()
	if err != nil {
		utils.WriteError(c, 500, err)
		return
	}

	ingressList, err := h.clusterStateRetriever.GetIngresses()
	if err != nil {
		utils.WriteError(c, 500, err)
		return
	}

	response := model.ClusterStateResponse{
		ServerVersion: serverVersion,
		Nodes:         nodeList,
		Deployments:   deploymentList,
		Pods:          podList,
		Services:      serviceList,
		Ingresses:     ingressList,
		ActivePod:     "b1a82198dad1cafb21a142f7bead3bc4eb2ef169",
	}

	utils.WriteJSON(c, 200, response)
}
