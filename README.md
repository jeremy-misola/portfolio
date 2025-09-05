# Living Portfolio - DevOps Architecture

> **A production-grade, self-updating portfolio demonstrating enterprise DevOps practices, Kubernetes orchestration, infrastructure automation, and modern full-stack development.**

## 🌐 Live Website

**[jeremymr.dev](https://jeremymr.dev)** - **The website is currently down due to a power outage lasting until midnight tomorrow**

[![Website](https://img.shields.io/badge/Website-jeremymr.dev-blue?style=for-the-badge&logo=globe)](https://jeremymr.dev)
[![Status](https://img.shields.io/badge/Status-Live%20Production-brightgreen?style=for-the-badge&logo=check-circle)](https://jeremymr.dev)
[![Deployment](https://img.shields.io/badge/Deployment-Kubernetes-blue?style=for-the-badge&logo=kubernetes)](https://jeremymr.dev)

<div align="center">
  <img src="https://img.shields.io/badge/Go-1.24.4+-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go Version">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Kubernetes-1.28+-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes">
  <img src="https://img.shields.io/badge/Ansible-8.0+-EE0000?style=for-the-badge&logo=ansible&logoColor=white" alt="Ansible">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" alt="Prometheus">
</div>

---

## Overview

This portfolio represents a **production-grade DevOps platform** that demonstrates enterprise-level infrastructure automation, cloud-native development, and operational excellence. The system actively monitors and displays real-time Kubernetes cluster metrics, CI/CD pipeline status, infrastructure health, and application performance, serving as a comprehensive showcase of DevOps engineering capabilities and modern software delivery practices.

## 🏗️ Architecture

<details>
<summary><strong>🚀 DevOps & Infrastructure (Primary Focus)</strong></summary>

- **Container Orchestration**: Production Kubernetes (K3s) cluster with high availability
- **Infrastructure as Code**: Comprehensive Ansible automation for cluster provisioning and management
- **CI/CD Pipeline**: GitHub Actions with automated testing, building, and deployment
- **Monitoring & Observability**: Prometheus metrics, Grafana dashboards, and custom application metrics
- **Containerization**: Multi-stage Docker builds with security scanning and optimization
- **Configuration Management**: Ansible playbooks for automated infrastructure deployment

</details>

<details>
<summary><strong>⚙️ Backend (Go)</strong></summary>

- **Language**: Go 1.24.4 with enterprise-grade error handling and logging
- **Framework**: Gorilla Mux for RESTful API routing with middleware support
- **Architecture**: Clean, modular microservices architecture with clear separation of concerns
- **Logging**: Structured logging with Zerolog for production debugging and monitoring
- **Monitoring**: Prometheus metrics integration with custom business metrics
- **Kubernetes Integration**: Native Kubernetes Go client (`k8s.io/client-go`) for cluster management, pod operations, deployment scaling, and real-time cluster state monitoring
- **Prometheus Integration**: Prometheus Go client (`github.com/prometheus/client_golang`) for custom metrics collection, application monitoring, and operational KPIs

</details>

<details>
<summary><strong>🎨 Frontend (Next.js 15)</strong></summary>

- **Framework**: Next.js 15 with React 19 for optimal performance and developer experience
- **Styling**: Tailwind CSS v4 with modern design system and component library
- **UI Components**: Radix UI primitives for accessible, production-ready components
- **Animations**: Framer Motion + GSAP for smooth, performant user interactions
- **3D Graphics**: OGL for WebGL rendering and advanced visualizations
- **State Management**: Modern React patterns with hooks and context for scalable state

</details>

## ✨ Key Features

<details>
<summary><strong>🏭 Enterprise DevOps & Infrastructure</strong></summary>

- **Production Kubernetes Management**: Real-time cluster state visualization with operational insights
- **Infrastructure Automation**: Ansible-driven cluster provisioning, scaling, and maintenance
- **CI/CD Excellence**: Automated testing, building, and deployment pipelines with GitHub Actions
- **Monitoring & Alerting**: Comprehensive observability with Prometheus, custom metrics, and health checks
- **Configuration Management**: Infrastructure as Code with version-controlled Ansible playbooks

</details>

<details>
<summary><strong>📊 Real-Time Operations Dashboard</strong></summary>

- **Cluster Health Monitoring**: Live pod, deployment, and service status tracking
- **Infrastructure Metrics**: Node health, resource utilization, and performance indicators
- **Pipeline Visibility**: Real-time CI/CD status and deployment tracking
- **Operational Insights**: Automated infrastructure health monitoring and alerting

</details>

<details>
<summary><strong>🌐 Modern Web Experience</strong></summary>

- **Responsive Design**: Mobile-first, accessible interface with professional aesthetics
- **Performance Optimization**: Smooth animations and transitions with optimal rendering
- **Theme Support**: Dark/light mode with consistent design language
- **Real-Time Updates**: Live data integration for dynamic user experience

</details>

## 🔧 Technical Implementation

### DevOps & Infrastructure Services
```go
// Enterprise-grade service architecture
├── cluster/     # Kubernetes cluster management and operations
├── monitoring/  # Metrics, health monitoring, and observability
├── pipeline/    # CI/CD pipeline integration and automation
└── types/       # Shared data structures and type definitions
```

### Production API Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/cluster/state` | Real-time cluster operational status |
| `GET /api/v1/monitoring/metrics` | Prometheus-compatible metrics endpoint |
| `GET /api/v1/pipeline` | CI/CD pipeline status and deployment metrics |
| `GET /api/v1/monitoring/application-metrics` | Custom business and operational metrics |

### Frontend Architecture
<details>
<summary><strong>Component Overview</strong></summary>

- **Hero Section**: Professional introduction with enterprise-grade animations
- **Kubernetes Operations**: Real-time cluster visualization and management interface
- **Monitoring Dashboard**: Comprehensive metrics and health indicators
- **DevOps Showcase**: Infrastructure automation and configuration management display
- **Ansible Integration**: Configuration management and infrastructure as Code demonstration

</details>

## 🚀 Live Deployment

**This portfolio is actively deployed and accessible at: [jeremymr.dev](https://jeremymr.dev)**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Now-blue?style=for-the-badge&logo=play-circle)](https://jeremymr.dev)

The live deployment demonstrates real-time DevOps operations, including:
- Active Kubernetes cluster monitoring
- Live CI/CD pipeline status
- Real-time infrastructure metrics
- Production-grade monitoring and alerting

## 🛠️ Getting Started (Local Development)

## Development

### Prerequisites
- Go 1.24.4+
- Node.js 18+ (for frontend)
- Docker
- Kubernetes cluster (K3s recommended)
- Ansible 8.0+

<details>
<summary><strong>Backend Development</strong></summary>

```bash
cd backend
make build    # Build binary
make run      # Run with hot reload
make test     # Run tests
```

</details>

<details>
<summary><strong>Frontend Development</strong></summary>

```bash
cd frontend/portfolio
npm run dev     # Development server
npm run build   # Production build
npm run lint    # Lint code
```

</details>

<details>
<summary><strong>Infrastructure Development</strong></summary>

```bash
cd scripts/ansible/k3s-ansible
cp inventory-sample.yml inventory.yml
# Edit inventory.yml with your cluster details
ansible-playbook playbooks/site.yml -i inventory.yml
```

</details>

## 📈 Monitoring & Observability

<details>
<summary><strong>Monitoring Stack</strong></summary>

- **Application Metrics**: Custom business metrics and operational KPIs
- **Infrastructure Metrics**: Comprehensive system and cluster health monitoring
- **Prometheus Integration**: Industry-standard monitoring stack with custom exporters
- **Real-time Logging**: Structured logging with Zerolog for production debugging
- **Health Checks**: Automated endpoint health monitoring and alerting
- **Performance Metrics**: Response time, throughput, and resource utilization tracking

</details>

## 🚀 Deployment

### Production Deployment
This portfolio is actively deployed using enterprise-grade DevOps practices:
- **Container Orchestration**: Kubernetes (K3s) with automated scaling and high availability
- **CI/CD Pipeline**: GitHub Actions with automated testing, building, and deployment
- **Infrastructure as Code**: Ansible playbooks for consistent, repeatable deployments
- **Monitoring**: Real-time observability with Prometheus and custom metrics

### Local Development Deployment
<details>
<summary><strong>Docker Commands</strong></summary>

```bash
# Backend
docker build -t living-portfolio-backend ./backend
docker run -p 8080:8080 living-portfolio-backend

# Frontend
docker build -t living-portfolio-frontend ./frontend
docker run -p 3000:3000 living-portfolio-frontend

# Kubernetes
kubectl apply -f k8s/
```

</details>

## 🎯 Why This Portfolio Stands Out

### For Hiring Managers
1. **Production-Grade DevOps**: Real infrastructure automation and Kubernetes operations
2. **Enterprise Architecture**: Clean, scalable microservices with proper monitoring
3. **Infrastructure as Code**: Comprehensive Ansible automation and configuration management
4. **Full-Stack DevOps**: Backend APIs, frontend UIs, and infrastructure automation
5. **Live Operations**: Portfolio actively demonstrates real-time DevOps capabilities

### Technical Excellence
<details>
<summary><strong>Key Strengths</strong></summary>

- **Clean Architecture**: Well-structured, maintainable, enterprise-grade code
- **Production Ready**: Comprehensive error handling, logging, monitoring, and alerting
- **Scalable Design**: Microservices architecture with clear separation of concerns
- **Modern DevOps Practices**: Infrastructure as Code, CI/CD automation, container orchestration
- **Infrastructure Automation**: Ansible, Kubernetes, Docker, and monitoring integration

</details>

## 📚 API Documentation

### Cluster State
```json
{
  "serverVersion": "v1.28.0",
  "nodes": [...],
  "deployments": [...],
  "pods": [...],
  "services": [...],
  "ingresses": [...]
}
```

### Monitoring Endpoints
| Endpoint | Description |
|----------|-------------|
| `/metrics` | Prometheus format metrics |
| `/monitoring/status` | Application health status |
| `/monitoring/application-metrics` | Custom business metrics |

## 🤝 Contributing

This is a personal portfolio project, but contributions and suggestions are welcome!

## 📄 License

MIT License - feel free to use this as inspiration for your own projects.

## 👨‍💻 About the Developer

This portfolio demonstrates my expertise in:
- **DevOps Engineering**: Kubernetes orchestration, infrastructure automation, CI/CD pipelines
- **Backend Development**: Go microservices, RESTful APIs, production-grade systems
- **Frontend Development**: React, Next.js, modern web applications
- **Infrastructure**: Ansible automation, monitoring, container orchestration
- **System Design**: Scalable architectures, clean code, operational excellence

---

<div align="center">
  <strong>🌐 <a href="https://jeremymr.dev">Visit the live portfolio at jeremymr.dev</a></strong>
</div>

**This isn't just a portfolio - it's proof that I can build and operate enterprise-grade DevOps systems that actually work in production.**
