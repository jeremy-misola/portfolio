package main

import (
	"backendV2/internal/handler"
	"backendV2/internal/middleware"
	"backendV2/internal/platform"
	"backendV2/internal/service"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
	kubeClient, err := platform.CreateKubeClient()
	if err != nil {
		log.Fatal("couldn't get kubernetes client")
	}
	kubernetesService := service.NewKubernetesService(kubeClient)
	kubernetesHandler := handler.NewKubernetesHandler(kubernetesService)
	monitoringService := service.NewMonitoringService(kubeClient)

	monitoringHandler := handler.NewMonitoringHandler(monitoringService)

	router := gin.Default()

	router.Use(middleware.MetricsGin())
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))
	router.GET("api/v2/metrics/traffic-distribution", monitoringHandler.GetTrafficDistribution)

	router.GET("/", homePage)
	router.GET("/api/v2/cluster-state", kubernetesHandler.GetClusterState)
	router.Run()
}

func homePage(c *gin.Context) {
	c.String(http.StatusOK, "This is my home page")
}
