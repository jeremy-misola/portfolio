package api

import (
	"backend/config"
	"backend/services/cluster"
	"backend/services/monitoring"
	"backend/services/pipeline"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
	"k8s.io/client-go/kubernetes"
)

type APIServer struct {
	addr       string
	config     config.Config
	kubeClient *kubernetes.Clientset
}

func NewAPIServer(addr string, config config.Config, client *kubernetes.Clientset) *APIServer {
	return &APIServer{
		addr:       addr,
		config:     config,
		kubeClient: client,
	}
}
func healthzHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	// You can return a simple JSON response to be extra sure
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()
	router.HandleFunc("/healthz", healthzHandler).Methods("GET")
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	pipelineHandler := pipeline.NewHandler()
	pipelineHandler.RegisterRoutes(subrouter)

	monitoringHandler := monitoring.NewHandler()
	monitoringHandler.RegisterRoutes(subrouter)

	clusterHandler := cluster.NewHandler(s.kubeClient)
	clusterHandler.RegisterRoutes(subrouter)

	log.Info().Msg("This is a structured log message.")
	fmt.Println("This is the regular print statement")
	fmt.Fprintln(os.Stderr, "This is a log message that shows up right away.")

	return http.ListenAndServe(s.addr, router)
}
