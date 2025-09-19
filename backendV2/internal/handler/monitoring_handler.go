package handler

import (
	"backendV2/internal/utils"

	"github.com/gin-gonic/gin"
)

type MonitoringController struct {
	monitoringServiceImpl MonitoringService
}

type MonitoringService interface {
	SayHello() string
}

func NewMonitoringHandler(monitoringServiceImpl MonitoringService) *MonitoringController {
	return &MonitoringController{
		monitoringServiceImpl: monitoringServiceImpl,
	}
}

func (h *MonitoringController) ReturnHello(c *gin.Context) {
	myString := h.monitoringServiceImpl.SayHello()
	utils.WriteJSON(c, 200, myString)
}

func (h *MonitoringController) GetTrafficDistribution(c *gin.Context) {
	trafficDistribution := h.MonitoringServiceImpl.GetTrafficDistribution()
	utils.WriteJSON(c, 200, trafficDistribution)
}
