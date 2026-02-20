"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';

export default function Education() {
  const locale = useLocale();
  const [education, setEducation] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/education');
      if (res.ok) {
        setEducation(await res.json());
      }
    }
    load();
  }, []);

  const formatDate = (date) => {
    if (!date) return locale === 'fr' ? 'Present' : 'Present';
    return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <section id="education" className="section-shell">
      <div className="container mx-auto px-4">
        <div className="mb-8 px-1">
          <p className="section-kicker">{locale === 'fr' ? 'Apprentissage' : 'Learning'}</p>
          <h2 className="section-title section-title-serif">{locale === 'fr' ? 'Education' : 'Education'}</h2>
        </div>

        <div className="bento-grid">
          {education.map((item, index) => (
            <article
              key={item.id}
              className={`glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-4 sm:p-6 ${index % 3 === 0 ? 'md:col-span-4' : 'md:col-span-2'}`}
              style={{ animationDelay: `${Math.min(index * 80, 340)}ms` }}
            >
              <h3 className="text-xl font-black tracking-tight">{item.school}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.location}</p>

              <p className="mt-4 font-semibold text-base">
                {locale === 'fr' ? item.degree_fr : item.degree_en}
              </p>

              <Badge variant="outline" className="mt-3 text-xs">
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Badge>

              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {locale === 'fr' ? item.description_fr : item.description_en}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
