package types

type DashboardData struct {
	InfraStatus     InfraStatus          `json:"infraStatus"`
	ResourceUsage   []ResourceUsagePoint `json:"resourceUsage"`
	HTTPMetrics     []HTTPMetricPoint    `json:"httpMetrics"`
	EndpointTraffic []EndpointTraffic    `json:"endpointTraffic"`
	SLOBurn         []SLOBurnPoint       `json:"sloBurn"`
	UptimeChecks    []UptimeCheck        `json:"uptimeChecks"`
	AlertVolume     []AlertVolumePoint   `json:"alertVolume"`
	NetworkPolicies []NetworkPolicy      `json:"networkPolicies"`
	K8sEvents       []K8sEvent           `json:"k8sEvents"`
}

type InfraStatus struct {
	PodName   string `json:"podName"`
	NodeName  string `json:"nodeName"`
	Namespace string `json:"namespace"`
}

type ResourceUsagePoint struct {
	Name   string  `json:"name"`
	CPU    float64 `json:"cpu"`
	Memory float64 `json:"memory"`
}

type HTTPMetricPoint struct {
	Name    string  `json:"name"`
	RPS     int     `json:"rps"`
	Latency float64 `json:"latency"`
}

type EndpointTraffic struct {
	Name  string `json:"name"`
	Value int    `json:"value"`
	Fill  string `json:"fill"`
}

type SLOBurnPoint struct {
	Time   string  `json:"time"`
	Burn1h float64 `json:"burn1h"`
	Burn6h float64 `json:"burn6h"`
}

type UptimeCheck struct {
	Region string  `json:"region"`
	Uptime float64 `json:"uptime"`
}

type AlertVolumePoint struct {
	Day      string `json:"day"`
	Critical int    `json:"critical"`
	Warning  int    `json:"warning"`
	Info     int    `json:"info"`
}

type NetworkPolicy struct {
	Name     string `json:"name"`
	Status   string `json:"status"`
	Enforces string `json:"enforces"`
}

type K8sEvent struct {
	Time    string `json:"time"`
	Type    string `json:"type"`
	Reason  string `json:"reason"`
	Message string `json:"message"`
}
