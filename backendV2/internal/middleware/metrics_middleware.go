package middleware

import (
	"backendV2/model"
	"net/http"
)

func Metrics(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
		path := r.URL.Path
		model.HTTPRequestsTotal.WithLabelValues(path).Inc()
	})
}
