package api

import (
	"backend/config"
	"backend/services/cluster"
	"backend/services/monitoring"
	"backend/services/pipeline"
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

func (s *APIServer) Run() error {
	router := mux.NewRouter()
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
