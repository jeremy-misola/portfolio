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
  ShieldCheck,
  Terminal,
  ArrowRight,
  UserPlus,
} from "lucide-react";

// --- Data for the component ---

const configSteps = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "System Hardening",
    description: "Run system-wide updates to keep servers patched and secure.",
  },
  {
    icon: <UserPlus className="h-8 w-8 text-primary" />,
    title: "User Management",
    description: "Easily add new administrative users with SSH access.",
  },
];

const codeSnippets = {
  addUser: `
---
- name: Add a new user
  hosts: all
  become: yes

  vars_prompt:
    - name: "username"
      prompt: "Enter the username"
      private: no
    - name: "ssh_key"
      prompt: "Paste the user's public SSH key"
      private: no

  tasks:
    - name: Create a new user with sudo privileges
      ansible.builtin.user:
        name: "{{ username }}"
        state: present
        groups: sudo
        append: yes
        create_home: yes
        shell: /bin/bash

    - name: Add SSH key for the new user
      ansible.posix.authorized_key:
        user: "{{ username }}"
        key: "{{ ssh_key }}"
        state: present
`,
  updateServers: `
---
- name: Update all servers
  hosts: all
  become: yes  # Use 'sudo' to run the command

  tasks:
    - name: Update apt cache and upgrade all packages
      ansible.builtin.apt:
        update_cache: yes
        upgrade: dist
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
    <section id="provisioning" className="w-full bg-background py-16 md:py-24 scroll-mt-24">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-semibold">
            Terraform + Ansible
          </Badge>
          <h2 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Automating Server Administration with Ansible
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            After provisioning VMs with{" "}
            <span className="font-semibold text-primary/90">Terraform</span>,
            Ansible handles ongoing server administration tasks like user management
            and system updates.
          </p>
        </div>

        {/* Configuration Steps Grid */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
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
          <Tabs defaultValue="addUser" className="w-full max-w-2xl">
            <div className="flex items-center justify-center">
              <Terminal className="mr-3 h-6 w-6 text-muted-foreground" />
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="addUser">Add User</TabsTrigger>
                <TabsTrigger value="updateServers">System Update</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="addUser">
              <Card className="border-border/60 shadow-md">
                <CardHeader>
                  <CardTitle>On-Demand User Creation</CardTitle>
                  <CardDescription>
                    This playbook prompts for a username and a public SSH key to
                    create a new sudo-enabled user on all servers, simplifying
                    access management.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <CodeBlock>{codeSnippets.addUser}</CodeBlock>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="updateServers">
              <Card className="border-border/60 shadow-md">
                <CardHeader>
                  <CardTitle>Centralized System Updates</CardTitle>
                  <CardDescription>
                    Run this simple playbook to update the package cache and
                    upgrade all packages on every server in your inventory.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <CodeBlock>{codeSnippets.updateServers}</CodeBlock>
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
}