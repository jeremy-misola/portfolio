"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Layers, BarChart2, GitCommit, GitPullRequest, FileCode, Users, GitMerge, Timer } from 'lucide-react';

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

export default function GitOpsShowcase() {
    return (
        <section id="gitops" className="w-full scroll-mt-24">
        <Card className="w-full" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center"><Layers style={{ color: 'var(--primary)' }} className="mr-2 h-8 w-8" /> My DevOps Workflow</CardTitle>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>An inside look into the architecture and processes that build and deploy this website.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="repository" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
                        <TabsTrigger value="repository"><BarChart2 className="mr-2 h-4 w-4" />Repository Analytics</TabsTrigger>
                        <TabsTrigger value="pipeline"><GitMerge className="mr-2 h-4 w-4" />Pipeline Analytics</TabsTrigger>
                    </TabsList>
                    
                    {/* Repository Analytics Tab */}
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
                    
                    {/* Pipeline Analytics Tab */}
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