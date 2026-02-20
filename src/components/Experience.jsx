"use client"

import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Briefcase, Calendar, Clock, CheckCircle, Tag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

function Experience() {
  const t = useTranslations("Experience");
  const locale = useLocale();
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch("/api/experience");
        const data = await response.json();
        setExperience(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching experience:", error);
        setExperience([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short' });
  };

  const getStatusBadge = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const now = new Date();

    if (!end || end > now) {
      return (
        <Badge variant="default" className="bg-sky-500/85 text-white">
          <Clock className="h-3 w-3 mr-1" />
          {locale === 'fr' ? 'Actuel' : 'Current'}
        </Badge>
      );
    }

    if (start > now) {
      return (
        <Badge variant="default" className="bg-amber-500/85 text-white">
          <Calendar className="h-3 w-3 mr-1" />
          {locale === 'fr' ? 'A venir' : 'Upcoming'}
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="bg-emerald-500/85 text-white">
        <CheckCircle className="h-3 w-3 mr-1" />
        {locale === 'fr' ? 'Termine' : 'Completed'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <section id="experience" className="section-shell">
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
    <section id="experience" className="section-shell">
      <div className="container mx-auto px-4">
        <div className="mb-8 px-1">
          <p className="section-kicker">{locale === 'fr' ? 'Parcours' : 'Career Path'}</p>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">
            {locale === 'fr'
              ? "Mon evolution dans le DevOps et le cloud-native."
              : "My progression through DevOps and cloud-native roles."}
          </p>
        </div>

        {experience.length === 0 ? (
          <div className="glass-panel chrome-stroke rounded-3xl p-10 text-center text-muted-foreground">
            {locale === 'fr' ? "Aucune experience disponible." : "No experience data available."}
          </div>
        ) : (
          <div className="bento-grid">
            {experience.map((exp, index) => {
              const spanClass = index % 3 === 0 ? "md:col-span-4" : "md:col-span-2";
              return (
                <article
                  key={exp.id}
                  className={`glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-4 sm:p-6 ${spanClass}`}
                  style={{ animationDelay: `${Math.min(index * 80, 360)}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-xl sm:text-2xl font-black tracking-tight">
                        {locale === 'fr' ? exp.position_fr : exp.position_en || exp.position}
                      </h3>
                      <p className="text-muted-foreground mt-1">{exp.company}</p>
                    </div>
                    {getStatusBadge(exp.startDate, exp.endDate)}
                  </div>

                  <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {locale === 'fr' ? exp.description_fr : exp.description_en || exp.description}
                  </p>

                  <div className="mt-3.5 sm:mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : t("present")}
                    </Badge>
                    {exp.technologies?.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
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

export default Experience;
