package types

type Node struct {
	Name   string `json:"name"`
	Status string `json:"name"`
}
type Deployment struct {
	Id    string `json:"name"`
	Name  string `json:"name"`
	Image string `json:"name"`
}

type Pod struct {
	Name         string `json:"name"`
	Node         string `json:"name"`
	Status       string `json:"name"`
	DeploymentID string `json:"name"`
}

type Service struct {
	ID           string `json:"name"`
	Name         string `json:"name"`
	Type         string `json:"name"`
	ClusterIP    string `json:"name"`
	Ports        string `json:"name"`
	DeploymentID string `json:"name"`
}
type Ingress struct {
	ID        string `json:"name"`
	Name      string `json:"name"`
	Host      string `json:"name"`
	TLS       string `json:"name"`
	ServiceID string `json:"name"`
}

type Replica struct {
	Desired string `json:"name"`
	Ready   string `json:"name"`
}
