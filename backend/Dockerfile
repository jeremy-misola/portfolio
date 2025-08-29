FROM golang:1.25-alpine3.22 AS build

WORKDIR /backend

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["go", "run", "cmd/main.go"]