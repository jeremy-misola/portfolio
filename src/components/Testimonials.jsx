"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Testimonials() {
  const locale = useLocale();
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: '', company: '', position: '', content: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  async function loadTestimonials() {
    const res = await fetch('/api/testimonials');
    if (res.ok) {
      setTestimonials(await res.json());
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: '', company: '', position: '', content: '', rating: 5 });
        alert(locale === 'fr' ? 'Temoignage soumis pour approbation.' : 'Testimonial submitted for approval.');
      } else {
        alert(locale === 'fr' ? 'Impossible de soumettre le temoignage.' : 'Could not submit testimonial.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="testimonials" className="section-shell">
      <div className="container mx-auto px-4">
        <div className="mb-8 px-1">
          <p className="section-kicker">{locale === 'fr' ? 'Retours' : 'Feedback'}</p>
          <h2 className="section-title">{locale === 'fr' ? 'Temoignages' : 'Testimonials'}</h2>
        </div>

        <div className="bento-grid">
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((t, index) => (
              <article
                key={t.id}
                className="glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-4 sm:p-5"
                style={{ animationDelay: `${Math.min(index * 80, 300)}ms` }}
              >
                <h3 className="text-lg font-black tracking-tight">{t.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.position} {t.company ? `- ${t.company}` : ''}
                </p>
                <p className="text-sm mt-3 leading-relaxed">{t.content}</p>
                <Badge variant="outline" className="mt-4">{t.rating}/5</Badge>
              </article>
            ))}
          </div>

          <div className="glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-5 sm:p-6 md:col-span-2" style={{ animationDelay: '180ms' }}>
            <h3 className="text-xl font-black tracking-tight mb-4">
              {locale === 'fr' ? 'Soumettre un temoignage' : 'Submit a testimonial'}
            </h3>
            <form onSubmit={submit} className="space-y-3">
              <Input required placeholder={locale === 'fr' ? 'Nom' : 'Name'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder={locale === 'fr' ? 'Entreprise' : 'Company'} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Input placeholder={locale === 'fr' ? 'Poste' : 'Position'} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              <Textarea required placeholder={locale === 'fr' ? 'Votre temoignage' : 'Your testimonial'} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) || 5 })} />
              <Button className="w-full" disabled={submitting} type="submit">
                {submitting ? (locale === 'fr' ? 'Envoi...' : 'Submitting...') : (locale === 'fr' ? 'Soumettre' : 'Submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
