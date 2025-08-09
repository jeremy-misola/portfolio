"use client"
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { 
  User, 
  Layers, 
  Activity, 
  GitMerge, 
  TerminalSquare,
  FileText
} from "lucide-react";

// --- Animation Variants (No changes here) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// --- UPDATED NavItem Component ---
function NavItem({ href, title, description, icon, className = "" }) {
  const Icon = icon;
  return (
    <motion.a
      href={href}
      className={`block ${className}`}
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full flex flex-col hover:border-primary/80 transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <motion.div whileHover={{ y: -4 }}>
            <Icon className="h-8 w-8 mb-4 text-primary" />
          </motion.div>
          
          {/* 
            UPDATED: The container height is now h-20 to fit the larger text.
            This still ensures that descriptions below are perfectly aligned.
          */}
          <div className="h-20"> 
            {/* UPDATED: Title is now larger with text-3xl */}
            <CardTitle className="text-3xl font-black tracking-tight">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base font-normal text-muted-foreground">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.a>
  );
}

// --- Navigation Component (No changes here) ---
function Navigation() {
  return (
    <section id="navigation" className="py-24" aria-labelledby="navigation-heading">
      <h2 id="navigation-heading" className="text-center text-4xl font-cal tracking-tight mb-12">
        Explore the Stack
      </h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <NavItem
          href="#about"
          title="About Me"
          description="My background, skills, and resume."
          icon={User}
          className="md:col-span-1"
        />
        <NavItem
          href="#cluster"
          title="Live Kubernetes Cluster"
          description="An interactive map of the K3s cluster this portfolio runs on."
          icon={Layers}
          className="md:col-span-2"
        />
        <NavItem
          href="#monitoring"
          title="Live Monitoring"
          description="See real-time performance metrics from Prometheus & Grafana."
          icon={Activity}
          className="md:col-span-2"
        />
        <NavItem
          href="#gitops"
          title="GitOps & CI/CD"
          description="The automated GitOps workflow with ArgoCD."
          icon={GitMerge}
          className="md:col-span-1"
        />
        <NavItem
          href="#provisioning"
          title="Ansible Provisioning"
          description="How the cluster nodes were configured with Ansible."
          icon={TerminalSquare}
          className="md:col-span-3"
        />
      </motion.div>
    </section>
  );
}

export default Navigation;