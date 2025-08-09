import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Server,
  PackageCheck,
  ShieldCheck,
  Settings2,
  Terminal,
  ArrowRight,
  FileCode,
} from "lucide-react";

// --- Data for the component ---

const configSteps = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "System Hardening",
    description: "Applied security policies and system-wide updates.",
  },
  {
    icon: <PackageCheck className="h-8 w-8 text-primary" />,
    title: "Install Runtimes",
    description: "Automated the installation of the containerd runtime.",
  },
  {
    icon: <Settings2 className="h-8 w-8 text-primary" />,
    title: "Configure Kernel",
    description: "Set required kernel parameters for Kubernetes networking.",
  },
  {
    icon: <FileCode className="h-8 w-8 text-primary" />,
    title: "Add K8s Repo",
    description: "Configured the APT repository for Kubernetes binaries.",
  },
];

const codeSnippets = {
  packages: `
- name: Install prerequisite packages
  apt:
    name:
      - containerd
      - apt-transport-https
      - ca-certificates
    state: present
    update_cache: yes
`,
  kernel: `
- name: Load required kernel modules
  modprobe:
    name: "{{ item }}"
    state: present
  loop:
    - overlay
    - br_netfilter
`,
  sysctl: `
- name: Set required sysctl params for Kubernetes
  sysctl:
    name: "{{ item.key }}"
    value: "{{ item.value }}"
    sysctl_set: yes
    state: present
    reload: yes
  with_items:
    - { key: 'net.bridge.bridge-nf-call-iptables', value: '1' }
    - { key: 'net.ipv4.ip_forward', value: '1' }
`,
};

// --- Helper component for code blocks ---
const CodeBlock = ({ children }) => (
  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted/50 p-4 font-mono text-sm text-muted-foreground shadow-inner">
    <code>{children.trim()}</code>
  </pre>
);

// --- Main Component ---
export default function Ansible() {
  return (
    <section id="ansible" className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-semibold">
            Terraform + Ansible
          </Badge>
          <h2 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Configuring the Nodes with Ansible
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            After provisioning the VMs with{" "}
            <span className="font-semibold text-primary/90">Terraform</span>,
            Ansible configures each node to be a production-ready baseline for
            Kubernetes.
          </p>
        </div>

        {/* Configuration Steps Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {configSteps.map((step) => (
            <Card
              key={step.title}
              className="transform-gpu transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <CardHeader className="items-center pb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  {step.icon}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="mb-1 text-base font-semibold">
                  {step.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Code Snippets */}
        <div className="mt-16 flex justify-center">
          <Tabs defaultValue="packages" className="w-full max-w-2xl">
            <div className="flex items-center justify-center">
              <Terminal className="mr-3 h-6 w-6 text-muted-foreground" />
              <TabsList>
                <TabsTrigger value="packages">Install Packages</TabsTrigger>
                <TabsTrigger value="kernel">Kernel Modules</TabsTrigger>
                <TabsTrigger value="sysctl">Network Params</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="packages">
              <Card className="border-border/60 shadow-md">
                <CardContent className="p-0">
                  <CodeBlock>{codeSnippets.packages}</CodeBlock>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="kernel">
              <Card className="border-border/60 shadow-md">
                <CardContent className="p-0">
                  <CodeBlock>{codeSnippets.kernel}</CodeBlock>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sysctl">
              <Card className="border-border/60 shadow-md">
                <CardContent className="p-0">
                  <CodeBlock>{codeSnippets.sysctl}</CodeBlock>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action Button */}
        <div className="mt-16 text-center">
          <Button
            asChild
            size="lg"
            className="group shadow-lg transition-shadow hover:shadow-xl"
          >
            <a
              href="https://github.com/your-username/your-ansible-repo" // <-- IMPORTANT: Change this link!
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-3 h-5 w-5" />
              Explore Ansible Playbooks
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};