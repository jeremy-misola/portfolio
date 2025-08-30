package cluster

import (
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
	pods, err := h.clientset.CoreV1().Pods("default").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		utils.WriteError(w, 500, err)
	}
	utils.WriteJSON(w, 200, pods)

	for _, pod := range pods.Items {
		fmt.Printf("found pod: %s \n", pod.Name)
	}
}
