package main

import (
	"backend/internal/handler"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func main() {
	fmt.Println("Starting server")
	r1 := chi.NewRouter()
	r1.Use(middleware.Logger)
	r1.Use(middleware.Recoverer)

	r1.Route("/api", func(r chi.Router) {
		r.Get("/repo", handler.GetRepositoryStats)
	})
	err := http.ListenAndServe(":3000", r1)
	if err != nil {
		fmt.Println(err)
	}
}
