package api

import (
	"backend/config"
	"backend/services/monitoring"
	"backend/services/pipeline"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

type APIServer struct {
	addr   string
	config config.Config
}

func NewAPIServer(addr string, config config.Config) *APIServer {
	return &APIServer{
		addr:   addr,
		config: config,
	}
}
func healthzHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
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

	log.Info().Msg("This is a structured log message.")
	fmt.Println("This is the regular print statement")
	fmt.Fprintln(os.Stderr, "This is a log message that shows up right away.")

	return http.ListenAndServe(s.addr, router)
}
