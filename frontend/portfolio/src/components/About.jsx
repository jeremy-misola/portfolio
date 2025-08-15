// src/components/AboutMe.jsx

"use client"; // Required for interactivity and animations

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Cloud, Layers, Linkedin, FileText } from 'lucide-react';

// --- Centralized Animation Configuration ---
const elegantEase = [0.22, 1, 0.36, 1]; // A gentle, fast-to-slow ease
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: elegantEase },
    },
  },
  scrollReveal: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: elegantEase },
    },
  },
};

// --- Data Arrays for Cleaner Mapping ---
const philosophies = [
  {
    icon: <Bot size={28} />,
    title: "Automation First",
    description: "I strive to automate everything from CI/CD pipelines to infrastructure provisioning, reducing manual effort and ensuring repeatable consistency."
  },
  {
    icon: <Cloud size={28} />,
    title: "Cloud-Native by Design",
    description: "I leverage the power of the cloud to architect and build robust, fault-tolerant, and scalable systems that are prepared for modern demands."
  },
  {
    icon: <Layers size={28} />,
    title: "Infrastructure as Code",
    description: "I treat infrastructure as a software project, defining and managing its state with code to enable versioning, peer review, and full transparency."
  }
];

const skills = ['Kubernetes', 'Docker', 'Go (Golang)', 'Ansible', 'Prometheus', 'Grafana', 'ArgoCD', 'GitHub Actions', 'React', 'PostgreSQL', 'AWS', 'GitOps'];

// --- Sub-Components for Elegance ---
const PhilosophyItem = ({ icon, title, description }) => (
  <motion.div variants={animations.item} className="flex items-start space-x-6">
    <div className="flex-shrink-0">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-primary">
        {icon}
      </div>
    </div>
    <div>
      <h4 className="text-xl font-semibold text-foreground">{title}</h4>
      <p className="mt-2 text-lg text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

const AboutMe = () => {
  return (
    <motion.section 
      id="about"
      className="bg-background text-foreground py-24 md:py-32 scroll-mt-24"
      initial="hidden"
      animate="visible"
      variants={animations.container}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* --- LEFT COLUMN: AVATAR & CTA --- */}
          <motion.div 
            className="lg:col-span-4 flex flex-col items-center text-center lg:sticky lg:top-32"
            variants={animations.item}
          >
            <motion.div whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
              <Avatar className="w-56 h-56 border-8 border-background shadow-2xl">
                <AvatarImage src="https://github.com/shadcn.png" alt="Your Name" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            </motion.div>
            <h2 className="mt-8 text-4xl font-bold tracking-tight">Your Name</h2>
            <p className="mt-2 text-xl text-muted-foreground">DevOps & Cloud Engineer</p>
            
            <div className="mt-10 w-full max-w-xs space-y-4">
              <Button size="lg" className="w-full" asChild>
                <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" /> Connect on LinkedIn
                </a>
              </Button>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                 <a href="/path-to-your-resume.pdf" download>
                  <FileText className="mr-2 h-5 w-5" /> Download Resume
                </a>
              </Button>
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN: NARRATIVE & SKILLS --- */}
          <div className="lg:col-span-8">
            <motion.div className="mb-24" variants={animations.item}>
              <h1 className="text-6xl font-bold tracking-tighter text-foreground leading-tight mb-8">
                Building Bridges Between Code and Cloud.
              </h1>
              <p className="text-xl text-muted-foreground leading-loose">
                Hello! I'm a passionate DevOps engineer dedicated to creating resilient, scalable, and highly automated infrastructure. My work empowers development teams to innovate faster and more reliably. I believe in a culture of collaboration and continuous improvement, where the operational backbone of an application is as elegant as its code.
              </p>
            </motion.div>

            <motion.div 
              className="space-y-16 mb-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={animations.container}
            >
              {philosophies.map((p) => (
                <PhilosophyItem key={p.title} {...p} />
              ))}
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={animations.scrollReveal}
            >
              <h3 className="text-3xl font-bold tracking-tight mb-8">Core Competencies</h3>
              <div className="flex flex-wrap gap-4">
                {skills.map((skill) => (
                  <motion.div key={skill} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                    <Badge className="px-5 py-3 text-lg cursor-pointer">{skill}</Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutMe;