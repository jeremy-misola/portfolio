package main

import (
	"backend/cmd/api"
	"backend/config"
	"fmt"
	"log"
)

func main() {
	fmt.Println("testing123")
	fmt.Println("this is the beginning of my app")

	// injecting config into apiServer
	server := api.NewAPIServer(":8080", config.Envs)
	runErr := server.Run()
	if runErr != nil {
		log.Fatal(runErr)
	}
}
