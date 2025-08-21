package pipeline

import (
	"backend/utils"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/pipeline", h.handlePipeline).Methods("GET")
}

func (h *Handler) handlePipeline(w http.ResponseWriter, r *http.Request) {
	repoStats, err := callGithubAPI("repos/jeremy-misola/portfolio")
	if err != nil {
		utils.WriteError(w, 503, err)
	}
	utils.WriteJSON(w, 200, string(repoStats))
}

func callGithubAPI(endpoint string) ([]byte, error) {
	baseURL := "http://api.github.com/"
	resp, err := http.Get(baseURL + endpoint)
	if err != nil {
		return nil, err
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return data, nil
}
