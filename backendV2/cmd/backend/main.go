package main

import (
	"backendV2/internal/handler"
	"backendV2/internal/platform"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	kubeClient, err := platform.CreateKubeClient()
	if err != nil {
		log.Fatal("couldn't get kubernetes client")
	}
	kubernetesHandler := handler.NewKubernetesHandler(kubeClient)

	router := gin.Default()

	router.GET("/", homePage)
	router.GET("/api/v2/cluster-state", kubernetesHandler.GetClusterState)
	router.Run()
}

func homePage(c *gin.Context) {
	c.String(http.StatusOK, "This is my home page")
}
