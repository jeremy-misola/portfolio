package pipeline

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
	router.HandleFunc("/pipeline", h.handlePipeline).Methods("POST")

}


func (h *Handler) handlePipeline(w http.ResponseWriter, r *http.Request) {
}