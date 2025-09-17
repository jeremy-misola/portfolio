package handler

import (
	"github.com/gin-gonic/gin"
)

kubeClient :=

func GetClusterState(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.String(200, "tsreicanctsri")
}
