"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowDownRight, Github, Linkedin, FileDown } from 'lucide-react';

export default function ProfileHero() {
  const locale = useLocale();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings');
      if (res.ok) {
        setSettings(await res.json());
      }
    }
    load();
  }, []);

  const headline = locale === 'fr'
    ? settings?.headline_fr || settings?.headline_en
    : settings?.headline_en || settings?.headline_fr;

  const bio = locale === 'fr'
    ? settings?.bio_fr || settings?.bio_en
    : settings?.bio_en || settings?.bio_fr;

  return (
    <section id="hero" className="section-shell pt-10 sm:pt-14">
      <div className="container mx-auto px-4">
        <div className="bento-grid">
          <article className="glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-5 sm:p-8 md:col-span-4" style={{ animationDelay: '60ms' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="section-kicker">{settings?.fullName || 'Portfolio'}</p>
                <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                  <span className="kinetic-heading">{headline || 'Professional Portfolio'}</span>
                </h1>
                <p className="section-subtitle max-w-2xl">{bio || 'Manage your profile content from the admin panel.'}</p>
              </div>
              <div className="hidden sm:block">
                <img
                  src="/20250824_0907251.jpg"
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/10 shadow-lg"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
              <Button asChild>
                <a href="#projects">
                  {locale === 'fr' ? 'Voir les projets' : 'View Projects'} <ArrowDownRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/Jake_s_Resume-3.pdf" download>
                  <FileDown className="h-4 w-4" /> {locale === 'fr' ? 'CV' : 'Resume'}
                </a>
              </Button>
            </div>
          </article>

          <aside className="glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-5 sm:p-8 md:col-span-2" style={{ animationDelay: '140ms' }}>
            <p className="section-kicker">{locale === 'fr' ? 'Connecter' : 'Connect'}</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              {locale === 'fr' ? 'Liens rapides' : 'Quick Links'}
            </h2>
            <div className="mt-5 space-y-2.5 sm:space-y-3">
              {settings?.linkedinUrl && (
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href={settings.linkedinUrl} target="_blank" rel="noreferrer">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </Button>
              )}
              {settings?.githubUrl && (
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href={settings.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                </Button>
              )}
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="#contact">{locale === 'fr' ? 'Contacter' : 'Contact Me'}</a>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
