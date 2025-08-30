package types

type Node struct {
	Name   string `json:"name"`
	Status string `json:"status"`
}
type Deployment struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Replicas Replica `json:"replicas"`
	Image    string  `json:"image"`
}

type Pod struct {
	Name         string `json:"name"`
	Node         string `json:"node"`
	Status       string `json:"status"`
	DeploymentID string `json:"deploymentId"`
}

type Service struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Type         string `json:"type"`
	ClusterIP    string `json:"clusterIP"`
	Ports        string `json:"ports"`
	DeploymentID string `json:"deploymentId"`
}
type Ingress struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Host      string `json:"host"`
	TLS       bool   `json:"tls"`
	ServiceID string `json:"serviceId"`
}

type Replica struct {
	Desired int `json:"desired"`
	Ready   int `json:"ready"`
}

type ClusterStateResponse struct {
	ServerVersion string       `json:"serverVersion"`
	Nodes         []Node       `json:"nodes"`
	Deployments   []Deployment `json:"deployments"`
	Pods          []Pod        `json:"pods"`
	Services      []Service    `json:"services"`
	Ingresses     []Ingress    `json:"ingresses"`
	ActivePod     string       `json:"activePod"`
}
