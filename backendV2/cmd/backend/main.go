package main

import (
	"net/http"

	"backendV2/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/api/v2/cluster-state", handler.GetClusterState)
	router.Run()
}

func homePage(c *gin.Context) {
	c.String(http.StatusOK, "This is my home page")
}
