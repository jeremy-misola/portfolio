package api

import (
	"backend/config"
	"backend/services/cluster"
	"backend/services/monitoring"
	"backend/services/pipeline"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type APIServer struct {
	addr string
	config config.Config
}

func NewAPIServer(addr string, config config.Config) *APIServer {
	return &APIServer{
		addr: addr,
		config: config,
	}
}

func (s *APIServer) Run() error{
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	pipelineHandler := pipeline.NewHandler()	
	pipelineHandler.RegisterRoutes(subrouter)

	monitoringHandler := monitoring.NewHandler()
	monitoringHandler.RegisterRoutes(subrouter)

	clusterHandler := cluster.NewHandler()
	clusterHandler.RegisterRoutes(subrouter)

	log.Println("Listening on", s.addr)
	return http.ListenAndServe(s.addr, router)
}