package cluster

import (
	"net/http"

	"github.com/gorilla/mux"
)

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/cluster/state", h.handleClusterState).Methods("GET")

}

func (h *Handler) handleClusterState(w http.ResponseWriter, r *http.Request) {

}
