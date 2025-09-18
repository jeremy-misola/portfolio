package handler

import (
	"backendV2/internal/utils"

	"github.com/gin-gonic/gin"
)

type MonitoringController struct {
	monitoringServiceImpl MonitoringServiceImpl
}

type MonitoringServiceImpl interface {
	SayHello() string
}

func NewMonitoringHandler(monitoringServiceImpl MonitoringServiceImpl) *MonitoringController {
	return &MonitoringController{
		monitoringServiceImpl: monitoringServiceImpl,
	}
}

func (h *MonitoringController) ReturnHello(c *gin.Context) {
	myString := h.monitoringServiceImpl.SayHello()
	utils.WriteJSON(c, 200, myString)
}
