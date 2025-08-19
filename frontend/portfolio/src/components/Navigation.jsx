"use client"
// Checklist (visual + animation plan):
// 1) Animated section heading underline + subtle entrance reveal
// 2) Cards get glass/gradient styling, soft shadow, and smooth hover lift
// 3) Gradient accent bar + glow aura on hover for each card
// 4) Icons float/pulse subtly; scale/tilt micro-interactions on hover/tap
// 5) Grid items stagger in with spring motion; focus-visible ring for a11y
// 6) Decorative blurred gradient background for the section
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
  TerminalSquare
} from "lucide-react";

// --- Animation Variants (enhanced) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
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
      stiffness: 120,
      damping: 14,
    },
  },
};

// Subtle floating animation for icons
const iconFloat = {
  initial: { y: 0 },
  hover: { y: -4, transition: { type: "spring", stiffness: 250, damping: 18 } },
};

// --- UPDATED NavItem Component with modern visuals ---
function NavItem({ href, title, description, icon, className = "" }) {
  const Icon = icon;
  return (
    <motion.a
      href={href}
      className={`group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl ${className}`}
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
    >
      {/* Gradient aura on hover (visual flourish) */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
           aria-hidden="true"
           style={{
             background:
               "radial-gradient(60% 50% at 50% 0%, hsl(var(--primary)/0.25) 0%, transparent 60%), radial-gradient(60% 50% at 0% 100%, hsl(var(--primary)/0.2) 0%, transparent 60%)",
           }}
      />

      <Card className="relative h-full flex flex-col overflow-hidden rounded-xl border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/50">
        {/* Animated top accent bar */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <CardHeader>
          {/* Icon with soft circular background + float on hover */}
          <motion.div
            variants={iconFloat}
            initial="initial"
            whileHover="hover"
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15"
          >
            <Icon className="h-6 w-6" />
          </motion.div>

          {/* Title block kept tall for alignment across cards */}
          <div className="h-20">
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

// --- Navigation Component (enhanced visuals) ---
function Navigation() {
  return (
    <section id="navigation" className="relative py-24" aria-labelledby="navigation-heading">
      {/* Decorative blurred gradient background for the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-40 max-w-4xl blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(40% 60% at 50% 50%, hsl(var(--primary)/0.18) 0%, transparent 70%)",
        }}
      />

      <h2 id="navigation-heading" className="mb-12 text-center text-4xl font-bold tracking-tight">
        <span className="relative inline-block">
          Explore the Stack
          {/* Animated underline */}
          <motion.span
            className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/60"
            initial={{ scaleX: 0, opacity: 0.4, transformOrigin: "left" }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          />
        </span>
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