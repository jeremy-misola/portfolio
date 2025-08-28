package main

import (
	"backend/cmd/api"
	"backend/config"
	"backend/platform/kubernetes"
	"log"
)

func main() {
	kubeClient, err := kubernetes.CreateKubeClient()
	if err != nil {
		log.Fatal(err)
	}
	// injecting config into apiServer
	server := api.NewAPIServer(":8080", config.Envs, kubeClient)
	runErr := server.Run()
	if runErr != nil {
		log.Fatal(runErr)
	}
}
