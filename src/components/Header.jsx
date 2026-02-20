"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Header');
  const pathname = usePathname();
  const basePath = `/${locale}`;

  if (pathname.includes('/admin')) {
    return null;
  }

  const links = [
    { href: `${basePath}#skills`, label: locale === 'fr' ? 'Competences' : 'Skills' },
    { href: `${basePath}#projects`, label: locale === 'fr' ? 'Projets' : 'Projects' },
    { href: `${basePath}#experience`, label: locale === 'fr' ? 'Experience' : 'Experience' },
    { href: `${basePath}#education`, label: locale === 'fr' ? 'Education' : 'Education' },
    { href: `${basePath}#hobbies`, label: locale === 'fr' ? 'Loisirs' : 'Hobbies' },
    { href: `${basePath}#testimonials`, label: locale === 'fr' ? 'Temoignages' : 'Testimonials' },
    { href: `${basePath}/contact`, label: locale === 'fr' ? 'Contact' : 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="chrome-stroke glass-panel micro-reveal container mx-auto rounded-2xl px-3.5 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          <a href={basePath} className="tap-scale text-sm sm:text-base font-black tracking-tight uppercase">
            Portfolio
          </a>

          <nav className="hidden lg:flex items-center gap-2 text-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="tap-scale rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
