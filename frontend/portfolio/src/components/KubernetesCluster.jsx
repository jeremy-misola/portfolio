"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Server, Cloud, Waypoints, Box, Network, CircleDot, GitCommitHorizontal } from 'lucide-react';

// --- UPDATED MOCK DATA ---
const newClusterData = {
    "serverVersion": "v1.30.2+k3s1",
    "nodes": [{"name": "k8s-control-plane-1", "status": "Ready"}], // Changed status to Ready for visuals
    "deployments": [
        {"id": "fb064257-159e-4bf8-9575-1c9c8a97416d", "name": "portfolio-backend-deployment", "replicas": {"desired": 3, "ready": 3}, "image": "jeremymisola/portfolio-backend:0.0.1"},
        {"id": "4227c48b-b858-4ad0-94d3-da3763fbb8a8", "name": "portfolio-frontend-deployment", "replicas": {"desired": 3, "ready": 3}, "image": "jeremymisola/portfolio-frontend:0.0.1"}
    ],
    "pods": [
        {"name": "portfolio-backend-deployment-57b88765bd-c78pv", "node": "k8s-control-plane-1", "status": "Running", "deploymentId": "fb064257-159e-4bf8-9575-1c9c8a97416d"},
        {"name": "portfolio-backend-deployment-57b88765bd-hz7vn", "node": "k8s-control-plane-1", "status": "Running", "deploymentId": "fb064257-159e-4bf8-9575-1c9c8a97416d"},
        {"name": "portfolio-backend-deployment-57b88765bd-nsm5g", "node": "k8s-control-plane-1", "status": "Running", "deploymentId": "fb064257-159e-4bf8-9575-1c9c8a97416d"},
        {"name": "portfolio-frontend-deployment-677d6dd5bc-4nvhx", "node": "k8s-control-plane-1", "status": "Running", "deploymentId": "4227c48b-b858-4ad0-94d3-da3763fbb8a8"},
        {"name": "portfolio-frontend-deployment-677d6dd5bc-l8gqz", "node": "k8s-control-plane-1", "status": "Running", "deploymentId": "4227c48b-b858-4ad0-94d3-da3763fbb8a8"},
        {"name": "portfolio-frontend-deployment-677d6dd5bc-q7vvm", "node": "k8s-control-plane-1", "status": "Running", "deploymentId": "4227c48b-b858-4ad0-94d3-da3763fbb8a8"}
    ],
    "services": [
        {"name": "portfolio-backend", "type": "ClusterIP", "clusterIP": "10.43.158.48", "ports": "8080/TCP", "deploymentId": "fb064257-159e-4bf8-9575-1c9c8a97416d"},
        {"name": "portfolio-frontend", "type": "ClusterIP", "clusterIP": "10.43.238.39", "ports": "8080/TCP", "deploymentId": "4227c48b-b858-4ad0-94d3-da3763fbb8a8"}
    ],
    "ingresses": [
        {"name": "portfolio-backend-ingress", "host": "my-portfolio-backend.com", "tls": false, "serviceId": "portfolio-backend"},
        {"name": "portfolio-frontend-ingress", "host": "my-portfolio-frontend.com", "tls": false, "serviceId": "portfolio-frontend"}
    ],
    "activePod": "portfolio-frontend-deployment-677d6dd5bc-q7vvm" // Updated to a valid pod name
};


// --- Custom React Flow Nodes (Unchanged) ---
const DeploymentNode = ({ data }) => (
    <Card className="w-64 border-2 border-primary shadow-lg">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-base">
          <Box className="mr-2 h-5 w-5 text-primary" />
          Deployment
        </CardTitle>
        <CardDescription className="text-xs">{data.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <div className="flex justify-between"><span>Replicas:</span> <Badge variant="secondary">{data.replicas.ready}/{data.replicas.desired}</Badge></div>
        <div className="mt-2 flex items-start justify-between">
          <span className="mt-1">Image:</span>
          <Badge variant="outline" className="text-right font-mono text-wrap max-w-[150px]">{data.image}</Badge>
        </div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
    </Card>
  );

  const PodNode = ({ data }) => (
    <Card className={`w-64 shadow-md ${data.isActive ? 'border-2 border-green-500 animate-pulse' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-sm">
          <Server className="mr-2 h-4 w-4 text-muted-foreground" />
          Pod
        </CardTitle>
        <CardDescription className="text-xs font-mono">{data.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <div className="flex justify-between"><span>Status:</span> <Badge className={data.status === 'Running' ? 'bg-green-600' : 'bg-yellow-500'}>{data.status}</Badge></div>
        <div className="flex justify-between mt-1"><span>Node:</span> <span className="font-mono">{data.node}</span></div>
        {data.isActive && <div className="text-center text-green-500 font-bold mt-2 text-xs">Serving Your Request!</div>}
      </CardContent>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
    </Card>
  );

  const ServiceNode = ({ data }) => (
    <Card className="w-64 border-dashed border-blue-500 shadow-lg">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-base">
          <Waypoints className="mr-2 h-5 w-5 text-blue-500" />
          Service
        </CardTitle>
        <CardDescription className="text-xs">{data.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <div className="flex justify-between"><span>Type:</span> <span className="font-mono">{data.type}</span></div>
        <div className="flex justify-between mt-1"><span>Cluster IP:</span> <span className="font-mono">{data.clusterIP}</span></div>
        <div className="flex justify-between mt-1"><span>Ports:</span> <span className="font-mono">{data.ports}</span></div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
    </Card>
  );

  const IngressNode = ({ data }) => (
    <Card className="w-64 border-dashed border-purple-500 shadow-lg">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-base">
          <Cloud className="mr-2 h-5 w-5 text-purple-500" />
          Ingress
        </CardTitle>
        <CardDescription className="text-xs">{data.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-xs">
         <div className="flex justify-between items-center"><span>Host:</span> <a href={`https://${data.host}`} target="_blank" rel="noopener noreferrer" className="font-mono text-purple-500 hover:underline">{data.host}</a></div>
         <div className="flex justify-between mt-1"><span>TLS Enabled:</span> <Badge variant={data.tls ? 'default' : 'destructive'}>{data.tls ? 'Yes' : 'No'}</Badge></div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
    </Card>
  );

const nodeTypes = { deployment: DeploymentNode, pod: PodNode, service: ServiceNode, ingress: IngressNode };

// --- Main Component ---
export default function KubernetesClusterSection() {

    const [k8sData, setK8sData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchClusterData = async () => {
        try {
          const response = await fetch('/api/cluster-state');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
          const liveData = await response.json();
          setK8sData(liveData);
          setError(null);
        } catch (error) {
          console.error("Could not fetch Kubernetes cluster data:", error.message);
          setError(error.message);
          setK8sData(newClusterData); // Fallback to new mock data
        }
      };

      fetchClusterData();
    }, []);


    const { initialNodes, initialEdges, activeDeployment } = useMemo(() => {
        if (!k8sData) {
            return { initialNodes: [], initialEdges: [], activeDeployment: null };
        }
        const nodes = [];
        const edges = [];
        const horizontalSpacing = 650;
        const verticalSpacing = 225;

        const activePodData = k8sData.pods.find(p => p.name === k8sData.activePod);
        const activeDeployment = activePodData
            ? k8sData.deployments.find(d => d.id === activePodData.deploymentId)
            : k8sData.deployments[0];

        k8sData.deployments.forEach((deployment, appIndex) => {
            const xPos = appIndex * horizontalSpacing;
            const service = k8sData.services.find(s => s.deploymentId === deployment.id);
            // CHANGE: Link ingress to service by name instead of id
            const ingress = service ? k8sData.ingresses.find(i => i.serviceId === service.name) : null;
            const pods = k8sData.pods.filter(p => p.deploymentId === deployment.id);

            if (ingress) {
                // CHANGE: Use ingress.name for the ID
                nodes.push({ id: `ingress-${ingress.name}`, type: 'ingress', position: { x: xPos, y: 0 }, data: { ...ingress } });
            }
            if (service) {
                // CHANGE: Use service.name for the ID
                nodes.push({ id: `service-${service.name}`, type: 'service', position: { x: xPos, y: verticalSpacing }, data: { ...service } });
            }
            nodes.push({ id: `deployment-${deployment.id}`, type: 'deployment', position: { x: xPos, y: verticalSpacing * 2 }, data: { ...deployment } });

            const podHorizontalSpacing = 270;
            const podStartX = xPos - ((pods.length - 1) * podHorizontalSpacing) / 2;

            pods.forEach((pod, podIndex) => {
                nodes.push({
                    id: `pod-${pod.name}`,
                    type: 'pod',
                    position: { x: podStartX + podIndex * podHorizontalSpacing, y: verticalSpacing * 3 },
                    data: { ...pod, isActive: pod.name === k8sData.activePod },
                });
                edges.push({
                    id: `e-dep-${deployment.id}-pod-${pod.name}`,
                    source: `deployment-${deployment.id}`,
                    target: `pod-${pod.name}`,
                    animated: true,
                    type: 'smoothstep'
                });
            });

            if (ingress && service) {
                // CHANGE: Use names for edge IDs and source/target
                edges.push({ id: `e-ing-${ingress.name}-svc-${service.name}`, source: `ingress-${ingress.name}`, target: `service-${service.name}`, animated: true, type: 'smoothstep' });
            }
            if (service) {
                // CHANGE: Use service.name for edge ID and source
                edges.push({ id: `e-svc-${service.name}-dep-${deployment.id}`, source: `service-${service.name}`, target: `deployment-${deployment.id}`, animated: true, type: 'smoothstep' });
            }
        });
        return { initialNodes: nodes, initialEdges: edges, activeDeployment };
    }, [k8sData]);

    if (!k8sData) {
        return <div>Loading Cluster Data...</div>;
    }

  return (
    <section id="cluster" className="py-16 sm:py-20 bg-muted/20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Live Cluster Explorer</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                This is a live, read-only view of the Kubernetes infrastructure serving this very page.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Network className="mr-2"/> Cluster Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">K8s Version</span>
                            <Badge variant="outline">{k8sData.serverVersion}</Badge>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Node Status</span>
                            <div className='flex items-center gap-2'>
                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                    {k8sData.nodes.filter(n => n.status === 'Ready').length} Ready
                                </Badge>
                                 <Badge variant="destructive">
                                    {k8sData.nodes.filter(n => n.status !== 'Ready').length} Unhealthy
                                </Badge>
                            </div>
                         </div>
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full">Show Nodes</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{k8sData.nodes.map(n => n.name).join(', ')}</p>
                                </TooltipContent>
                            </Tooltip>
                         </TooltipProvider>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><CircleDot className="mr-2 text-green-500"/>Active Pod</CardTitle>
                        <CardDescription>The exact pod serving your current request.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-green-900/50 rounded-lg border border-green-700 text-center">
                            <p className="font-mono text-lg text-green-300 break-all">{k8sData.activePod || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><GitCommitHorizontal className="mr-2"/> Active Deployment</CardTitle>
                         <CardDescription>The Git commit powering the active application.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Badge variant="secondary" className="font-mono text-sm break-all">
                           {/* CHANGE: Split image by ':' to get the version tag */}
                           {activeDeployment ? activeDeployment.image.split(':').pop() : 'N/A'}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2 min-h-[900px] rounded-lg border bg-background shadow-lg">
                 <ReactFlow
                    nodes={initialNodes}
                    edges={initialEdges}
                    nodeTypes={nodeTypes}
                    fitView
                    className="react-flow-bg"
                >
                    <Controls />
                    <MiniMap nodeStrokeWidth={3} zoomable pannable />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
      </div>
    </section>
  );
}