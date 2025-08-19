package pipeline

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/pipeline", h.handlePipeline).Methods("GET")

}

func (h *Handler) handlePipeline(w http.ResponseWriter, r *http.Request) {
	fmt.Println("test")
	fmt.Fprintf(w, "test")
	response, err := http.Get("http://api.github.com/repos/jeremy-misola/portfolio")
	if err!=nil{
		fm
	}
}
