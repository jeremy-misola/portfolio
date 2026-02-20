"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export default function Hobbies() {
  const locale = useLocale();
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/hobbies');
      if (res.ok) {
        setHobbies(await res.json());
      }
    }
    load();
  }, []);

  return (
    <section id="hobbies" className="section-shell">
      <div className="container mx-auto px-4">
        <div className="mb-8 px-1">
          <p className="section-kicker">{locale === 'fr' ? 'Vie au dela du travail' : 'Beyond Work'}</p>
          <h2 className="section-title">{locale === 'fr' ? 'Loisirs' : 'Hobbies'}</h2>
        </div>

        <div className="bento-grid">
          {hobbies.map((hobby, index) => (
            <article
              key={hobby.id}
              className={`glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-5 sm:p-6 ${index % 4 === 0 ? 'md:col-span-3' : 'md:col-span-2'}`}
              style={{ animationDelay: `${Math.min(index * 90, 360)}ms` }}
            >
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                {locale === 'fr' ? hobby.name_fr : hobby.name_en}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {locale === 'fr' ? hobby.description_fr : hobby.description_en}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
