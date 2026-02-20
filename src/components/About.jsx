// src/components/AboutMe.jsx

"use client"; // Required for interactivity and animations

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Layers, Linkedin, FileText, Github } from 'lucide-react'; // Removed Cloud icon
import { useTranslations } from 'next-intl';

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
const skills = [
  'Go', 'Java', 'Python', 'SQL',
  'Kubernetes', 'Operators', 'Docker', 'Terraform', 'Ansible',
  'Istio', 'Longhorn', 'OpenTelemetry',
  'GitOps (ArgoCD)', 'LGTM Stack', 'Chaos Engineering', 'CI/CD Pipelines'
];

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
  const t = useTranslations("About");

  // Data Arrays with Translations
  const philosophies = [
    {
      icon: <Bot size={28} />,
      title: t("philosophies.automation.title"),
      description: t("philosophies.automation.description")
    },
    {
      icon: <Layers size={28} />,
      title: t("philosophies.iac.title"),
      description: t("philosophies.iac.description")
    }
  ];

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
                {/* You can update the src to a direct link of your profile picture */}
                <AvatarImage src="https://github.com/jeremy-misola.png" alt="Jeremy Misola" />
                <AvatarFallback>JM</AvatarFallback>
              </Avatar>
            </motion.div>
            <h2 className="mt-8 text-4xl font-bold tracking-tight">Jeremy Misola</h2>
            <p className="mt-2 text-xl text-muted-foreground">{t("subtitle")}</p>

            <div className="mt-10 w-full max-w-xs space-y-4">
              <Button size="lg" className="w-full" asChild>
                <a href="https://linkedin.com/in/jeremy-misola-969402302" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" /> {t("connect")}
                </a>
              </Button>
              <Button size="lg" className="w-full" asChild>
                <a href="https://github.com/jeremy-misola" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" /> {t("follow")}
                </a>
              </Button>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                {/* This link now points to your resume on LimeWire */}
                <a
                  href="https://limewire.com/d/4MbNB#NfFbI688Ah"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-5 w-5" /> {t("resume")}
                </a>
              </Button>
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN: NARRATIVE & SKILLS --- */}
          <div className="lg:col-span-8">
            <motion.div className="mb-24" variants={animations.item}>
              <h1 className="text-6xl font-bold tracking-tighter text-foreground leading-tight mb-8">
                {t("title")}
              </h1>
              {/* This summary is adapted from your CV */}
              <p className="text-xl text-muted-foreground leading-loose">
                {t("description")}
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
              <h3 className="text-3xl font-bold tracking-tight mb-8">{t("skillsTitle")}</h3>
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