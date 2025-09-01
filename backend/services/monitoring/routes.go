package monitoring

import (
	"backend/utils"
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
	fmt.Println("http://prometheus-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090/api/v1/query?query=apiserver_request_total")
	resp, err := http.Get("http://prometheus-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090/api/v1/query?query=apiserver_request_total")
	if err != nil {
		utils.WriteError(w, 500, err)
	}
	fmt.Println(resp)

}
func (h *Handler) handleStatus(w http.ResponseWriter, r *http.Request) {
	fmt.Println("status")
}

func (h *Handler) handleInfrastructureMetrics(w http.ResponseWriter, r *http.Request) {
	fmt.Println("infra")
}
