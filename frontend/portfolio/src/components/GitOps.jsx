"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactFlow, MiniMap, Controls, Background, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { GitBranch, Layers, BarChart2, GitCommit, GitPullRequest, Tag, Bug, FileCode, Users, GitMerge, Timer } from 'lucide-react';
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
        { commit: 'r3s4t5u', duration: 188 }, { commit: 'v6w7x8y', duration: 195 },
    ],
    deploymentHealth: [
        { subject: 'Tests', A: 95, fullMark: 100 }, { subject: 'Linting', A: 100, fullMark: 100 },
        { subject: 'Security Scan', A: 85, fullMark: 100 }, { subject: 'Build Speed', A: 75, fullMark: 100 },
        { subject: 'Code Coverage', A: 92, fullMark: 100 },
    ],
    commitActivity: [
        { name: 'Week 1', commits: 40 }, { name: 'Week 2', commits: 30 },
        { name: 'Week 3', commits: 50 }, { name: 'Week 4', commits: 45 },
        { name: 'Week 5', commits: 60 }, { name: 'Week 6', commits: 55 },
    ],
    pullRequestAnalysis: [
        { state: 'Open', value: 12 },
        { state: 'Merged', value: 88 },
        { state: 'Closed', value: 5 },
    ],
    codeCoverage: [
        { name: 'Jan', coverage: 85 }, { name: 'Feb', coverage: 86 },
        { name: 'Mar', coverage: 88 }, { name: 'Apr', coverage: 90 },
        { name: 'May', coverage: 92 }, { name: 'Jun', coverage: 91 },
    ]
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

const nodeTypes = {
    branchNode: BranchNode,
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


export default function GitOpsShowcase() {
    return (
        <section id="gitops" className="w-full scroll-mt-24">
        <Card className="w-full" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center"><Layers style={{ color: 'var(--primary)' }} className="mr-2 h-8 w-8" /> My DevOps Workflow</CardTitle>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>An inside look into the architecture and processes that build and deploy this website.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="git" className="w-full">
                    {/* Updated TabsList to include three tabs */}
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                        <TabsTrigger value="git"><GitBranch className="mr-2 h-4 w-4" />Git Workflow</TabsTrigger>
                        <TabsTrigger value="repository"><BarChart2 className="mr-2 h-4 w-4" />Repository Analytics</TabsTrigger>
                        <TabsTrigger value="pipeline"><GitMerge className="mr-2 h-4 w-4" />Pipeline Analytics</TabsTrigger>
                    </TabsList>

                    {/* Git Workflow Tab */}
                    <TabsContent value="git">
                        <div className="mt-4 grid md:grid-cols-2 gap-6 items-start">
                            <div className="p-4 rounded-lg" style={{ border: '1px solid var(--border)' }}>
                                <h3 className="text-2xl font-semibold mb-4">Feature Branch Workflow</h3>
                                <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                                    This diagram shows the Git branching strategy. All development starts from a feature branch, is reviewed via a Pull Request into `develop`, and then promoted to `main` through a release process. This ensures code quality and a stable main branch.
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
                    
                    {/* NEW: Repository Analytics Tab */}
                    <TabsContent value="repository">
                        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                             <Card className="lg:col-span-2" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader>
                                    <CardTitle className="flex items-center"><GitCommit className="mr-2 h-5 w-5" /> Commit Activity Over Time</CardTitle>
                                    <CardDescription style={{ color: 'var(--muted-foreground)' }}>Weekly commit frequency in the repository.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={mockPipelineData.commitActivity}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                                            <YAxis stroke="var(--muted-foreground)" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                                            <Line type="monotone" dataKey="commits" name="Commits" stroke="var(--primary)" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader>
                                     <CardTitle className="flex items-center"><GitPullRequest className="mr-2 h-5 w-5" /> Pull Request Analysis</CardTitle>
                                     <CardDescription style={{ color: 'var(--muted-foreground)' }}>The current state of all PRs.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mockPipelineData.pullRequestAnalysis} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis type="number" stroke="var(--muted-foreground)" />
                                            <YAxis dataKey="state" type="category" width={80} stroke="var(--muted-foreground)" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="value" name="Count" fill="var(--chart-4)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                             <Card className="lg:col-span-3" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader>
                                     <CardTitle className="flex items-center"><FileCode className="mr-2 h-5 w-5" /> Code Coverage Trend</CardTitle>
                                     <CardDescription style={{ color: 'var(--muted-foreground)' }}>Test coverage percentage over the last six months.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={mockPipelineData.codeCoverage}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                                            <YAxis stroke="var(--muted-foreground)" domain={[80, 100]}/>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                                            <Area type="monotone" dataKey="coverage" name="Coverage %" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.6} unit="%" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    
                    {/* UPDATED: Pipeline Analytics Tab */}
                    <TabsContent value="pipeline">
                        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                             <Card className="lg:col-span-2" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader>
                                    <CardTitle className="flex items-center"><GitMerge className="mr-2 h-5 w-5" /> Build & Deployment Frequency</CardTitle>
                                    <CardDescription style={{ color: 'var(--muted-foreground)' }}>Number of builds and successful deployments per month.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mockPipelineData.buildFrequency}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                                            <YAxis stroke="var(--muted-foreground)" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                                            <Bar dataKey="builds" name="Builds" fill="var(--primary)" />
                                            <Bar dataKey="deployments" name="Deployments" fill="var(--chart-1)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                             <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader>
                                    <CardTitle className="flex items-center"><Timer className="mr-2 h-5 w-5" /> Recent Build Durations</CardTitle>
                                    <CardDescription style={{ color: 'var(--muted-foreground)' }}>Average build time in seconds for recent commits.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={mockPipelineData.buildDurations}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="commit" stroke="var(--muted-foreground)" />
                                            <YAxis stroke="var(--muted-foreground)" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line type="monotone" dataKey="duration" name="Duration (s)" stroke="var(--chart-5)" strokeWidth={2} unit="s" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="md:col-span-2 lg:col-span-3" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                                <CardHeader>
                                    <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> Deployment Health & Quality</CardTitle>
                                    <CardDescription style={{ color: 'var(--muted-foreground)' }}>A multi-factor health score for the latest deployment pipeline.</CardDescription>
                                </CardHeader>
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
        </section>
    );
}