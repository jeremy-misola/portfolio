package middleware

import (
	"backend/types"
	"net/http"
)

func Metrics(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
		path := r.URL.Path
		types.HTTPRequestsTotal.WithLabelValues(path).Inc()
	})
}
