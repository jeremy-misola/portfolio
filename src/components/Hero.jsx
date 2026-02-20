"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";

function Hero() {
  const t = useTranslations("Hero");

  return (
    <section
      id="hero"
      className="text-center py-24 sm:py-32 lg:py-40 px-4 bg-transparent"
      aria-labelledby="hero-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <span className="text-xl sm:text-2xl font-medium text-muted-foreground tracking-wide uppercase">
          {t("name")}
        </span>
      </motion.div>
      <motion.h1
        id="hero-heading"
        className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight font-sans leading-tight bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t("title")}
      </motion.h1>
      <motion.p
        className="max-w-3xl mx-auto mt-8 text-lg sm:text-2xl text-muted-foreground leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {t("subtitle")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10"
      >
        <Button size="lg" asChild>
          <a href="#navigation">
            {t("explore")} <ArrowDown className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </motion.div>

    </section>
  );
}

export default Hero;