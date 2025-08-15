package main

import (
	"backend/cmd/api"
	"backend/config"
	"log"
)

func main() {
	// injecting config into apiServer
	server := api.NewAPIServer(":8080", config.Envs)
	err := server.Run()
	if err!=nil {
		log.Fatal(err)
	}
}
