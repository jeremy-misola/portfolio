package utils

import (
	"github.com/gin-gonic/gin"
)

func WriteJSON(c *gin.Context, status int, v any) {
	c.Header("Content-Type", "application/json")
	c.JSON(status, v)
}

func WriteError(c *gin.Context, status int, err error) {
	c.Header("Content-Type", "application/json")
	c.JSON(status, map[string]string{"error": err.Error()})
}
