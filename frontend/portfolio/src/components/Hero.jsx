"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

function Hero() {
  return (
    <section
      id="hero"
      className="text-center py-24 sm:py-32 lg:py-40 px-4 bg-transparent"
      aria-labelledby="hero-heading"
    >
      <motion.h1
        id="hero-heading"
        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        A Living DevOps Portfolio
      </motion.h1>
      <motion.p
        className="max-w-3xl mx-auto mt-6 text-lg sm:text-xl text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        This website is a live demonstration of my cloud-native skills, running
        on a Kubernetes cluster I built, automated, and monitor.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10"
      >
        <Button size="lg" asChild>
          <a href="#navigation">
            Explore the Stack <ArrowDown className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </motion.div>

    </section>
  );
}

export default Hero;