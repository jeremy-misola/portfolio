"use client"

import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github, CheckCircle, Clock, AlertCircle, Tag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

function Projects() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-emerald-500/85 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("status.completed")}
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="default" className="bg-sky-500/85 text-white">
            <Clock className="h-3 w-3 mr-1" />
            {t("status.in-progress")}
          </Badge>
        );
      case "planned":
        return (
          <Badge variant="default" className="bg-amber-500/85 text-white">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t("status.planned")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <section id="projects" className="section-shell">
        <div className="container mx-auto px-4">
          <div className="glass-panel chrome-stroke micro-reveal rounded-3xl p-7 sm:p-8 text-center">
            <h2 className="section-title">{t("title")}</h2>
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-shell">
      <div className="container mx-auto px-4">
        <div className="mb-8 px-1">
          <p className="section-kicker">{locale === 'fr' ? 'Travaux recents' : 'Recent Work'}</p>
          <h2 className="section-title mt-2">
            <span className="kinetic-heading">{t("title")}</span>
          </h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        {projects.length === 0 ? (
          <div className="glass-panel chrome-stroke rounded-3xl p-10 text-center text-muted-foreground">
            {t("no_projects")}
          </div>
        ) : (
          <div className="bento-grid">
            {projects.map((project, index) => {
              const spanClass = index % 5 === 0 ? "md:col-span-4" : index % 2 === 0 ? "md:col-span-3" : "md:col-span-2";
              return (
                <article
                  key={project.id}
                  className={`glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-4 sm:p-6 ${spanClass}`}
                  style={{ animationDelay: `${Math.min(index * 70, 360)}ms` }}
                >
                  {project.images && project.images.length > 0 && (
                    <div className="mb-5 relative aspect-video overflow-hidden rounded-2xl border border-border/50">
                      <img
                        src={project.images[0]}
                        alt={`${project.title} screenshot`}
                        className="w-full h-full object-cover"
                      />
                      {project.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                          +{project.images.length - 1} {t("images")}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {getStatusBadge(project.status)}
                    <Badge variant="outline" className="text-xs">
                      {t("priority")} {project.priority}
                    </Badge>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">{project.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {locale === 'fr' ? project.description_fr : project.description_en || project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          {t("code")}
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button size="sm" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          {t("demo")}
                        </a>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
