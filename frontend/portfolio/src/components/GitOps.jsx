"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactFlow, MiniMap, Controls, Background, MarkerType, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { GitBranch, Layers, Rocket, BarChart2, GitCommit, GitPullRequest, Tag, Bug } from 'lucide-react';
import { memo } from 'react';

// --- Mock Data for Charts ---
const mockPipelineData = {
    buildFrequency: [
        { name: 'Jan', builds: 30, deployments: 22 }, { name: 'Feb', builds: 25, deployments: 19 },
        { name: 'Mar', builds: 45, deployments: 40 }, { name: 'Apr', builds: 38, deployments: 35 },
        { name: 'May', builds: 52, deployments: 48 }, { name: 'Jun', builds: 40, deployments: 37 },
    ],
    buildDurations: [
        { commit: 'a1b2c3d', duration: 185 }, { commit: 'e4f5g6h', duration: 192 },
        { commit: 'i7j8k9l', duration: 178 }, { commit: 'm0n1p2q', duration: 210 },
        { commit: 'r3s4t5u', duration: 188 },
    ],
    deploymentHealth: [
        { subject: 'Tests', A: 95, fullMark: 100 }, { subject: 'Linting', A: 100, fullMark: 100 },
        { subject: 'Security Scan', A: 85, fullMark: 100 }, { subject: 'Build Speed', A: 75, fullMark: 100 },
        { subject: 'Code Coverage', A: 92, fullMark: 100 },
    ],
};

// --- Custom Tooltip for Charts ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 rounded-lg shadow-lg" style={{
                backgroundColor: 'var(--popover)',
                color: 'var(--popover-foreground)',
                border: '1px solid var(--border)'
            }}>
                <p className="label font-bold">{`${label}`}</p>
                {payload.map((pld, index) => (
                    <p key={index} style={{ color: pld.color || pld.fill }} className="intro">{`${pld.name}: ${pld.value}${pld.unit || ''}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

// --- Custom Nodes for React Flow ---

const BranchNode = memo(({ data }) => {
    const icons = {
        main: <GitBranch className="h-5 w-5 mr-2" />,
        develop: <GitCommit className="h-5 w-5 mr-2" />,
        feature: <GitPullRequest className="h-5 w-5 mr-2" />,
        release: <Tag className="h-5 w-5 mr-2" />,
        hotfix: <Bug className="h-5 w-5 mr-2" />,
    };

    return (
        <div className="flex items-center p-2 rounded-md" style={{ background: data.style.background, color: data.style.color }}>
            {icons[data.type]}
            <span>{data.label}</span>
            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
    );
});

const PipelineNode = memo(({ data }) => (
    <div className="flex items-center p-3 rounded-lg shadow-md" style={{ background: data.style.background, color: data.style.color, border: `1px solid var(--border)` }}>
        {data.icon}
        <span className="font-semibold">{data.label}</span>
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
    </div>
));

const nodeTypes = {
    branchNode: BranchNode,
    pipelineNode: PipelineNode,
};

// --- Git Workflow Data ---
const gitWorkflowNodes = [
    { id: 'main', type: 'branchNode', data: { label: 'main', type: 'main', style: { background: 'var(--chart-3)', color: 'var(--foreground)' } }, position: { x: 250, y: 0 } },
    { id: 'develop', type: 'branchNode', data: { label: 'develop', type: 'develop', style: { background: 'var(--chart-5)', color: 'var(--foreground)' } }, position: { x: 250, y: 120 } },
    { id: 'feature', type: 'branchNode', data: { label: 'feature/new-auth', type: 'feature', style: { background: 'var(--accent)', color: 'var(--accent-foreground)' } }, position: { x: 50, y: 240 } },
    { id: 'release', type: 'branchNode', data: { label: 'release/v1.1.0', type: 'release', style: { background: 'var(--primary)', color: 'var(--primary-foreground)' } }, position: { x: 450, y: 240 } },
    { id: 'hotfix', type: 'branchNode', data: { label: 'hotfix/bug-fix', type: 'hotfix', style: { background: 'var(--destructive)', color: 'var(--destructive-foreground)' } }, position: { x: 50, y: 0 } },
];
const gitWorkflowEdges = [
    { id: 'e-dev-main', source: 'develop', target: 'main', animated: true, label: 'Merge to main' },
    { id: 'e-feat-dev', source: 'feature', target: 'develop', animated: true, label: 'PR to develop' },
    { id: 'e-rel-main', source: 'release', target: 'main', animated: true, label: 'Merge to main' },
    { id: 'e-rel-dev', source: 'release', target: 'develop', type: 'straight' },
    { id: 'e-hotfix-main', source: 'hotfix', target: 'main', animated: true, label: 'Urgent Fix' },
];

// --- CI/CD Pipeline Data ---
const cicdPipelineNodes = [
    { id: 'commit', type: 'pipelineNode', data: { label: 'Git Commit', icon: <GitCommit className="h-6 w-6 mr-3" />, style: { background: 'var(--chart-3)', color: 'var(--foreground)' } }, position: { x: 50, y: 50 } },
    { id: 'action', type: 'pipelineNode', data: { label: 'GitHub Action', icon: <Rocket className="h-6 w-6 mr-3 text-blue-500" />, style: { background: 'var(--primary)', color: 'var(--primary-foreground)' } }, position: { x: 300, y: 50 } },
    { id: 'build-test', type: 'pipelineNode', data: { label: 'Build & Test', icon: <BarChart2 className="h-6 w-6 mr-3 text-green-500" />, style: { background: 'var(--chart-4)', color: 'var(--foreground)' } }, position: { x: 50, y: 200 } },
    { id: 'docker', type: 'pipelineNode', data: { label: 'Push to Docker Hub', icon: <Layers className="h-6 w-6 mr-3 text-cyan-500" />, style: { background: 'var(--chart-5)', color: 'var(--foreground)' } }, position: { x: 300, y: 200 } },
    { id: 'argo', type: 'pipelineNode', data: { label: 'ArgoCD Sync', icon: <GitBranch className="h-6 w-6 mr-3 text-red-500" />, style: { background: 'var(--destructive)', color: 'var(--destructive-foreground)' } }, position: { x: 50, y: 350 } },
    { id: 'k8s', type: 'pipelineNode', data: { label: 'Deploy to K8s', icon: <Rocket className="h-6 w-6 mr-3 text-purple-500" />, style: { background: 'var(--chart-2)', color: 'var(--foreground)' } }, position: { x: 300, y: 350 } },
];
const cicdPipelineEdges = [
    { id: 'e1', source: 'commit', target: 'action', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2', source: 'action', target: 'build-test', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3', source: 'build-test', target: 'docker', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e4', source: 'docker', target: 'argo', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e5', source: 'argo', target: 'k8s', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];


export default function GitOpsShowcase() {
    return (
        <Card className="w-full" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center"><Layers style={{ color: 'var(--primary)' }} className="mr-2 h-8 w-8" /> My DevOps Workflow</CardTitle>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>An inside look into the architecture and processes that build and deploy this website.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="git" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                        <TabsTrigger value="git"><GitBranch className="mr-2 h-4 w-4" />Git Workflow</TabsTrigger>
                        <TabsTrigger value="cicd"><Rocket className="mr-2 h-4 w-4" />CI/CD Pipeline</TabsTrigger>
                        <TabsTrigger value="analytics"><BarChart2 className="mr-2 h-4 w-4" />Pipeline Analytics</TabsTrigger>
                    </TabsList>

                    {/* Git Workflow Tab */}
                    <TabsContent value="git">
                        <div className="mt-4 grid md:grid-cols-2 gap-6 items-start">
                            <div className="p-4 rounded-lg" style={{ border: '1px solid var(--border)' }}>
                                <h3 className="text-2xl font-semibold mb-4">Feature Branch Workflow</h3>
                                <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                                    This diagram shows the Git branching strategy. All development starts from a feature branch, is reviewed via a Pull Request into `develop`, and then promoted to `main` through a release process.
                                </p>
                            </div>
                            <div className="h-[500px] rounded-lg" style={{ border: '1px solid var(--border)' }}>
                                <ReactFlow
                                    defaultNodes={gitWorkflowNodes}
                                    defaultEdges={gitWorkflowEdges}
                                    nodeTypes={nodeTypes}
                                    defaultViewport={{ zoom: 1, x: 0, y: 50 }}
                                    fitView
                                >
                                    <MiniMap />
                                    <Controls />
                                    <Background color="var(--muted)" gap={16} />
                                </ReactFlow>
                            </div>
                        </div>
                    </TabsContent>

                    {/* CI/CD Pipeline Tab */}
                    <TabsContent value="cicd">
                        <div className="mt-4 grid md:grid-cols-2 gap-6 items-start">
                             <div className="p-4 rounded-lg" style={{ border: '1px solid var(--border)' }}>
                               <h3 className="text-2xl font-semibold mb-4">Automated CI/CD with GitOps</h3>
                               <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                                    Every `git push` triggers a fully automated pipeline. This process builds, tests, and containerizes the application, with ArgoCD handling the deployment to Kubernetes by ensuring the live state matches the desired state in Git.
                               </p>
                            </div>
                           <div className="h-[500px] rounded-lg" style={{ border: '1px solid var(--border)' }}>
                               <ReactFlow
                                    defaultNodes={cicdPipelineNodes}
                                    defaultEdges={cicdPipelineEdges}
                                    nodeTypes={nodeTypes}
                                    defaultViewport={{ zoom: 1, x: 0, y: 0 }}
                                    fitView
                                >
                                    <MiniMap />
                                    <Controls />
                               </ReactFlow>
                           </div>
                        </div>
                    </TabsContent>
                    
                    {/* Pipeline Analytics Tab */}
                    <TabsContent value="analytics">
                        <div className="grid gap-6 mt-6 md:grid-cols-2">
                             <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader>
                                    <CardTitle>Build & Deployment Frequency</CardTitle>
                                    <CardDescription style={{ color: 'var(--muted-foreground)' }}>Monthly totals for pipeline executions.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mockPipelineData.buildFrequency}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                                            <YAxis stroke="var(--muted-foreground)" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                                            <Bar dataKey="builds" fill="var(--chart-1)" name="Total Builds" />
                                            <Bar dataKey="deployments" fill="var(--chart-2)" name="Successful Deployments" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader><CardTitle>Recent Build Durations</CardTitle><CardDescription style={{ color: 'var(--muted-foreground)' }}>Time taken for the last 5 builds in the CI pipeline.</CardDescription></CardHeader>
                                <CardContent className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mockPipelineData.buildDurations} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis type="number" stroke="var(--muted-foreground)" />
                                            <YAxis dataKey="commit" type="category" width={80} stroke="var(--muted-foreground)" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                                            <Bar dataKey="duration" name="Duration (sec)" fill="var(--chart-3)" unit="s" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="md:col-span-2" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader><CardTitle>Latest Deployment Health</CardTitle><CardDescription style={{ color: 'var(--muted-foreground)' }}>A multi-factor health score for the last deployment.</CardDescription></CardHeader>
                                <CardContent className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockPipelineData.deploymentHealth}>
                                            <PolarGrid stroke="var(--border)" />
                                            <PolarAngleAxis dataKey="subject" stroke="var(--foreground)" />
                                            <PolarRadiusAxis stroke="var(--muted-foreground)" />
                                            <Radar name="Score" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}