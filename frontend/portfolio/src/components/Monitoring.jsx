"use client";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Server, ShieldCheck, Info, LayoutGrid, LineChart as LineChartIcon, Activity, AlertCircle, TrafficCone, FileClock } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- Mock Data (Expanded for New Visualizations) ---
const mockApiData = {
  infraStatus: { podName: 'portfolio-app-67d8fccb-x9vzb', nodeName: 'k8s-worker-node-2', namespace: 'production' },
  resourceUsage: [
    { name: '10:00', cpu: 25, memory: 45 }, { name: '10:05', cpu: 30, memory: 50 },
    { name: '10:10', cpu: 20, memory: 40 }, { name: '10:15', cpu: 28, memory: 55 },
    { name: '10:20', cpu: 35, memory: 60 }, { name: '10:25', cpu: 45, memory: 65 },
  ],
  httpMetrics: [
    { name: '10:00', rps: 120, latency: 55 }, { name: '10:05', rps: 150, latency: 60 },
    { name: '10:10', rps: 130, latency: 50 }, { name: '10:15', rps: 160, latency: 65 },
    { name: '10:20', rps: 180, latency: 70 }, { name: '10:25', rps: 200, latency: 75 },
  ],
  endpointTraffic: [
    { name: '/api/projects', value: 450, fill: 'var(--chart-1)' },
    { name: '/api/resume', value: 210, fill: 'var(--chart-2)' },
    { name: '/api/contact', value: 95, fill: 'var(--chart-3)' },
    { name: '/api/infra/status', value: 315, fill: 'var(--chart-4)' },
  ],
  // Monitoring-only new metrics (mocked)
  sloBurn: [
    { time: '10:00', burn1h: 0.8, burn6h: 0.6 },
    { time: '10:10', burn1h: 1.2, burn6h: 0.7 },
    { time: '10:20', burn1h: 0.9, burn6h: 0.8 },
    { time: '10:30', burn1h: 1.6, burn6h: 1.0 },
    { time: '10:40', burn1h: 0.7, burn6h: 0.9 },
    { time: '10:50', burn1h: 2.4, burn6h: 1.4 },
  ],
  uptimeChecks: [
    { region: 'US-East', uptime: 99.98 },
    { region: 'US-West', uptime: 99.95 },
    { region: 'EU', uptime: 99.97 },
    { region: 'APAC', uptime: 99.92 },
  ],
  alertVolume: [
    { day: 'Mon', critical: 1, warning: 3, info: 5 },
    { day: 'Tue', critical: 0, warning: 2, info: 4 },
    { day: 'Wed', critical: 2, warning: 4, info: 6 },
    { day: 'Thu', critical: 0, warning: 1, info: 3 },
    { day: 'Fri', critical: 3, warning: 5, info: 7 },
    { day: 'Sat', critical: 0, warning: 0, info: 2 },
    { day: 'Sun', critical: 0, warning: 1, info: 2 },
  ],
  networkPolicies: [
    { name: 'default-deny-all', status: 'Active', enforces: 'Ingress/Egress' },
    { name: 'allow-prometheus-scrape', status: 'Active', enforces: 'Ingress' },
    { name: 'allow-external-traffic', status: 'Active', enforces: 'Ingress' },
  ],
  k8sEvents: [
    { time: '2m ago', type: 'Normal', reason: 'ScalingReplicaSet', message: 'Scaled up replica set portfolio-app-67d8fccb to 1' },
    { time: '5m ago', type: 'Normal', reason: 'SuccessfulCreate', message: 'Created pod: portfolio-app-67d8fccb-x9vzb' },
    { time: '5m ago', type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned production/portfolio-app-67d8fccb-x9vzb to k8s-worker-node-2' },
    { time: '1h ago', type: 'Warning', reason: 'Unhealthy', message: 'Readiness probe failed: Get "http://10.1.2.3:8080/healthz": context deadline exceeded' },
  ]
};


// --- Helper & Reusable Components ---
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

const StatusCard = ({ icon, title, value, status, badgeStyle, description, tooltipText }) => (
  <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="flex items-center gap-2">
        {icon}
        <TooltipProvider>
          <ShadTooltip>
            <TooltipTrigger><Info className="h-4 w-4 cursor-pointer" style={{ color: 'var(--muted-foreground)' }} /></TooltipTrigger>
            <TooltipContent><p>{tooltipText}</p></TooltipContent>
          </ShadTooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-2 pt-1">
        <Badge style={badgeStyle}>{status}</Badge>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
      </div>
    </CardContent>
  </Card>
);


// --- Main Monitoring Dashboard Component ---

export default function MonitoringDashboardWithTabs() {
  const apiData = mockApiData;

  const successBadgeStyle = { backgroundColor: 'var(--chart-3)', color: 'var(--foreground)' };
  const outlineBadgeStyle = { border: '1px solid var(--border)', color: 'var(--foreground)' };

  return (
    <section id="monitoring" className="p-4 md:p-8 scroll-mt-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>Live Operations Dashboard</h2>
          <p className="mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            This dashboard provides a real-time view into the application's live performance and infrastructure health, served by a Go meta-API.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <StatusCard icon={<Server className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />} title="Active Pod" value={apiData.infraStatus.podName.split('-').slice(-1)[0]} status={apiData.infraStatus.namespace} badgeStyle={outlineBadgeStyle} description={`on ${apiData.infraStatus.nodeName}`} tooltipText="Pod & Node info from the K8s Downward API." />
          <StatusCard icon={<ShieldCheck className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />} title="Application Health" value="99.9% Uptime" status="Healthy" badgeStyle={successBadgeStyle} description="Last 24 hours" tooltipText="Overall health based on uptime and error rate." />
        </div>

        <Tabs defaultValue="application" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="application"><LineChartIcon className="w-4 h-4 mr-2"/>Application</TabsTrigger>
            <TabsTrigger value="infrastructure"><LayoutGrid className="w-4 h-4 mr-2"/>Infrastructure</TabsTrigger>
            <TabsTrigger value="reliability"><Activity className="w-4 h-4 mr-2"/>Reliability</TabsTrigger>
            <TabsTrigger value="events"><FileClock className="w-4 h-4 mr-2"/>Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="application">
            <div className="grid gap-6 mt-6 md:grid-cols-5">
              <Card className="md:col-span-3" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <CardHeader><CardTitle>HTTP Performance</CardTitle><CardDescription style={{ color: 'var(--muted-foreground)' }}>Request throughput and P95 latency.</CardDescription></CardHeader>
                <CardContent className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={apiData.httpMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis yAxisId="left" label={{ value: 'RPS', angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)' }} stroke="var(--muted-foreground)" />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Latency (ms)', angle: -90, position: 'insideRight', fill: 'var(--muted-foreground)' }} stroke="var(--muted-foreground)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                      <Bar yAxisId="left" dataKey="rps" name="Requests/sec" fill="var(--chart-1)" />
                      <Line yAxisId="right" type="monotone" dataKey="latency" name="P95 Latency" stroke="var(--chart-2)" strokeWidth={2} unit="ms"/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="md:col-span-2" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <CardHeader><CardTitle>API Endpoint Traffic</CardTitle><CardDescription style={{ color: 'var(--muted-foreground)' }}>Distribution of API calls by endpoint.</CardDescription></CardHeader>
                <CardContent className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={apiData.endpointTraffic} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {apiData.endpointTraffic.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure">
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <Card className="md:col-span-2" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                  <CardHeader><CardTitle>Live Resource Utilization</CardTitle><CardDescription style={{ color: 'var(--muted-foreground)' }}>CPU and Memory usage for the running pod.</CardDescription></CardHeader>
                  <CardContent className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={apiData.resourceUsage}>
                        <defs>
                          <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.8}/><stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0}/></linearGradient>
                          <linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.8}/><stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                        <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="var(--chart-4)" fillOpacity={1} fill="url(#c)" unit="%" />
                        <Area type="monotone" dataKey="memory" name="Memory (MB)" stroke="var(--chart-5)" fillOpacity={1} fill="url(#m)" unit="MB" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
              </Card>
              <Card className="md:col-span-2" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                  <CardHeader><CardTitle>Network Policies</CardTitle><CardDescription style={{ color: 'var(--muted-foreground)' }}>Live Kubernetes network policy status.</CardDescription></CardHeader>
                  <CardContent>
                    {apiData.networkPolicies.map((policy, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                          <TrafficCone className="h-5 w-5 mr-3" style={{ color: 'var(--primary)' }} />
                          <div>
                            <p className="font-mono text-sm">{policy.name}</p>
                            <p className="text-xs text-muted-foreground">{policy.enforces}</p>
                          </div>
                        </div>
                        <Badge variant={policy.status === 'Active' ? 'default' : 'destructive'} style={policy.status === 'Active' ? successBadgeStyle : {}}>{policy.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reliability">
            <div className="grid gap-6 mt-6 md:grid-cols-5">
              <Card className="md:col-span-3" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <CardHeader>
                  <CardTitle>Error Budget Burn</CardTitle>
                  <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                    Fast (1h) vs Slow (6h) burn rates. Watch for spikes over 2x.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={apiData.sloBurn}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                      <Line type="monotone" dataKey="burn1h" name="1h Burn" stroke="var(--destructive)" strokeWidth={2} />
                      <Line type="monotone" dataKey="burn6h" name="6h Burn" stroke="var(--chart-4)" strokeWidth={2} strokeDasharray="4 4" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-2" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <CardHeader>
                  <CardTitle>Synthetic Uptime</CardTitle>
                  <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                    Last 7 days uptime by region (HTTP check).
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={apiData.uptimeChecks}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="region" stroke="var(--muted-foreground)" />
                      <YAxis domain={[99.5, 100]} tickFormatter={(v) => `${v}%`} stroke="var(--muted-foreground)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                      <Bar dataKey="uptime" name="Uptime %" fill="var(--chart-3)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-5" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <CardHeader>
                  <CardTitle>Alert Volume by Severity</CardTitle>
                  <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                    Distribution of Alerts fired this week.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={apiData.alertVolume}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                      <Bar dataKey="critical" stackId="a" name="Critical" fill="var(--destructive)" />
                      <Bar dataKey="warning" stackId="a" name="Warning" fill="var(--chart-5)" />
                      <Bar dataKey="info" stackId="a" name="Info" fill="var(--chart-2)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <Card className="mt-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <CardHeader><CardTitle>Live Kubernetes Event Stream</CardTitle><CardDescription style={{ color: 'var(--muted-foreground)' }}>A real-time feed of events from the 'production' namespace.</CardDescription></CardHeader>
                <CardContent>
                    <ScrollArea className="h-[350px] w-full rounded-md border p-4">
                        {apiData.k8sEvents.map((event, index) => (
                            <div key={index}>
                                <div className="flex text-sm">
                                    {event.type === 'Warning' ? 
                                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-destructive" /> : 
                                      <Info className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                                    }
                                    <div className="grid gap-1">
                                      <p className="font-semibold">{event.reason} <span className="font-light text-muted-foreground ml-2">{event.time}</span></p>
                                      <p className="text-muted-foreground">{event.message}</p>
                                    </div>
                                </div>
                                {index < apiData.k8sEvents.length - 1 && <Separator className="my-4" />}
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </section>
  );
}