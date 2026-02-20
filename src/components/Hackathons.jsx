"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Code, Award } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const Hackathons = () => {
    const t = useTranslations("Hackathons");
    const locale = useLocale();

    const hackathonsData = [
        {
            title: "Vanier College CTF",
            award: locale === 'fr' ? "1ère place (Ex æquo)" : "1st Place (Tie)",
            category: locale === 'fr' ? "Sécurité, Ingénierie Inverse" : "Security, Reverse Engineering",
            date: "2024",
            icon: <Code className="h-6 w-6 text-primary" />,
        },
        {
            title: "Champlain College Hackathon",
            award: locale === 'fr' ? "1ère place" : "1st Place",
            category: locale === 'fr' ? "PyTorch, Vision par Ordinateur" : "PyTorch, Computer Vision",
            date: "2024",
            icon: <Trophy className="h-6 w-6 text-yellow-500" />,
        },
    ];

    return (
        <section id="hackathons" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold tracking-tight mb-4">
                        {t("title")}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        {locale === 'fr' ? "Compétitions et distinctions dans la communauté tech." : "Competitions and recognitions in the tech community."}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {hackathonsData.map((hack, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card className="h-full border-border/60 bg-background shadow-md hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                                {hack.icon}
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold">
                                                    {hack.title}
                                                </CardTitle>
                                                <CardDescription className="text-base font-medium text-primary mt-1">
                                                    {hack.award}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mt-2">
                                        <Badge variant="secondary" className="text-sm">
                                            {hack.category}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground font-medium flex items-center">
                                            <Award className="h-4 w-4 mr-1" />
                                            {hack.date}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hackathons;
