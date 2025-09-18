package model

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var HTTPRequestsTotal = promauto.NewCounterVec(
	prometheus.CounterOpts{
		Name: "backend_http_requests_total",
		Help: "Total number of http requests in backend",
	},
	[]string{"path"},
)
