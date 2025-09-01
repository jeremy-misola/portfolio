package monitoring

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/monitoring/application-metrics", h.handleApplicationMetrics).Methods("GET")
	router.Handle("/metrics", promhttp.Handler())
	router.HandleFunc("/monitoring/status", h.handleStatus).Methods("GET")
	router.HandleFunc("/monitoring/infrastructure-metrics", h.handleInfrastructureMetrics).Methods("GET")
}

func (h *Handler) handleApplicationMetrics(w http.ResponseWriter, r *http.Request) {
	fmt.Println("testing")
}

func (h *Handler) handleStatus(w http.ResponseWriter, r *http.Request) {
	fmt.Println("status")
}

func (h *Handler) handleInfrastructureMetrics(w http.ResponseWriter, r *http.Request) {
	fmt.Println("infra")
}
