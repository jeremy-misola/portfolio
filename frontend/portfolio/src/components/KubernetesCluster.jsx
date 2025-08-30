"use client";
import React, { useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Server, Cloud, Waypoints, Box, Network, CircleDot, GitCommitHorizontal } from 'lucide-react';

// --- MOCK DATA (Supports Multiple Applications) ---
const mockClusterData = {
  serverVersion: 'v1.28.3',
  nodes: [
    { name: 'k8s-worker-1', status: 'Ready' },
    { name: 'k8s-worker-2', status: 'Ready' },
    { name: 'k8s-worker-3', status: 'Ready' },
    { name: 'k8s-worker-4', status: 'NotReady' },
  ],
  deployments: [
    { id: 'dep1', name: 'portfolio-api-deployment', replicas: { desired: 2, ready: 2 }, image: 'my-registry/portfolio-api:v1.2.5-a1b2c3d' },
    { id: 'dep2', name: 'auth-service-deployment', replicas: { desired: 1, ready: 1 }, image: 'my-registry/auth-service:v2.1.0-e4f5g6h' },
  ],
  pods: [
    { name: 'portfolio-api-deployment-67d...', node: 'k8s-worker-2', status: 'Running', deploymentId: 'dep1' },
    { name: 'portfolio-api-deployment-95c...', node: 'k8s-worker-1', status: 'Running', deploymentId: 'dep1' },
    { name: 'auth-service-deployment-abc...', node: 'k8s-worker-3', status: 'Running', deploymentId: 'dep2' },
  ],
  services: [
    { id: 'svc1', name: 'portfolio-api-service', type: 'ClusterIP', clusterIP: '10.96.12.34', ports: '8080/TCP', deploymentId: 'dep1' },
    { id: 'svc2', name: 'auth-service-svc', type: 'ClusterIP', clusterIP: '10.96.56.78', ports: '80/TCP', deploymentId: 'dep2' },
  ],
  ingresses: [
    { id: 'ing1', name: 'portfolio-ingress', host: 'www.my-devops-portfolio.com', tls: true, serviceId: 'svc1' },
    { id: 'ing2', name: 'auth-ingress', host: 'auth.my-app.com', tls: true, serviceId: 'svc2' },
  ],
  activePod: 'portfolio-api-deployment-67d...',
};

const state = fetch('http://portfolio-backend/api/v1/cluster/state')
mockClusterData = JSON.parse(state)

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
  const k8sData = mockClusterData;

  // FIXED: Destructure activeDeployment from the useMemo result
  const { initialNodes, initialEdges, activeDeployment } = useMemo(() => {
    const nodes = [];
    const edges = [];
    const horizontalSpacing = 650;
    const verticalSpacing = 225;

    // This logic now correctly stays inside useMemo
    const activePodData = k8sData.pods.find(p => p.name === k8sData.activePod);
    const activeDeployment = activePodData 
        ? k8sData.deployments.find(d => d.id === activePodData.deploymentId) 
        : k8sData.deployments[0];

    k8sData.deployments.forEach((deployment, appIndex) => {
        const xPos = appIndex * horizontalSpacing;
        const service = k8sData.services.find(s => s.deploymentId === deployment.id);
        const ingress = service ? k8sData.ingresses.find(i => i.serviceId === service.id) : null;
        const pods = k8sData.pods.filter(p => p.deploymentId === deployment.id);
        
        if (ingress) {
            nodes.push({ id: `ingress-${ingress.id}`, type: 'ingress', position: { x: xPos, y: 0 }, data: { ...ingress } });
        }
        if (service) {
            nodes.push({ id: `service-${service.id}`, type: 'service', position: { x: xPos, y: verticalSpacing }, data: { ...service } });
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
            edges.push({ id: `e-ing-${ingress.id}-svc-${service.id}`, source: `ingress-${ingress.id}`, target: `service-${service.id}`, animated: true, type: 'smoothstep' });
        }
        if (service) {
            edges.push({ id: `e-svc-${service.id}-dep-${deployment.id}`, source: `service-${service.id}`, target: `deployment-${deployment.id}`, animated: true, type: 'smoothstep' });
        }
    });

    // FIXED: Return activeDeployment along with nodes and edges
    return { initialNodes: nodes, initialEdges: edges, activeDeployment };
  }, [k8sData]);

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
                           {/* This now works correctly */}
                           {activeDeployment ? activeDeployment.image.split('-').pop() : 'N/A'}
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
