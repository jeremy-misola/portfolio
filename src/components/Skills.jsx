"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';

export default function Skills() {
  const locale = useLocale();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/skills');
      if (res.ok) {
        setSkills(await res.json());
      }
    }
    load();
  }, []);

  return (
    <section id="skills" className="section-shell">
      <div className="container mx-auto px-4">
        <div className="glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-5 sm:p-8">
          <p className="section-kicker">{locale === 'fr' ? 'Boite a outils' : 'Toolkit'}</p>
          <h2 className="section-title">
            <span className="section-title-serif">{locale === 'fr' ? 'Competences' : 'Skills'}</span>
          </h2>

          <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
            {skills.map((skill, index) => (
              <Badge
                key={skill.id}
                variant="outline"
                className="tap-scale micro-reveal px-3 py-1.5 text-xs sm:text-sm font-semibold bg-background/50"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                {locale === 'fr' ? skill.name_fr : skill.name_en}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
