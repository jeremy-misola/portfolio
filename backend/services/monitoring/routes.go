package monitoring

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
	router.HandleFunc("/monitoring/application-metrics", h.handleApplicationMetrics).Methods("GET")
	router.HandleFunc("/monitoring/status", h.handleStatus).Methods("GET")
	router.HandleFunc("/monitoring/infrastructure-metrics", h.handleInfrastructureMetrics).Methods("GET")

}


func (h *Handler) handleApplicationMetrics(w http.ResponseWriter, r *http.Request) {
}
func (h *Handler) handleStatus(w http.ResponseWriter, r *http.Request) {
}
func (h *Handler) handleInfrastructureMetrics(w http.ResponseWriter, r *http.Request) {
}