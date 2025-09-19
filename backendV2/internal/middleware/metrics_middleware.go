package middleware

import (
	"backendV2/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Metrics(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
		path := r.URL.Path
		model.HTTPRequestsTotal.WithLabelValues(path).Inc()
	})
}

func MetricsGin() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		path := c.Request.URL.Path
		model.HTTPRequestsTotal.WithLabelValues(path)
	}
}
