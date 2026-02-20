"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactSection() {
  const locale = useLocale();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings');
      if (res.ok) {
        setSettings(await res.json());
      }
    }
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: '', email: '', subject: '', message: '' });
        alert(locale === 'fr' ? 'Message envoye.' : 'Message sent.');
      } else {
        alert(locale === 'fr' ? 'Echec de l envoi du message.' : 'Failed to send message.');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="section-shell">
      <div className="container mx-auto px-4">
        <div className="bento-grid">
          <div className="glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-5 sm:p-8 md:col-span-2" style={{ animationDelay: '60ms' }}>
            <p className="section-kicker">{locale === 'fr' ? 'Discutons' : 'Lets Talk'}</p>
            <h2 className="section-title mt-2">{locale === 'fr' ? 'Contact' : 'Contact'}</h2>
            <div className="mt-5 sm:mt-6 space-y-1.5 sm:space-y-2 text-muted-foreground text-sm sm:text-base">
              <p>{settings?.email}</p>
              <p>{settings?.phone}</p>
              <p>{settings?.location}</p>
            </div>
          </div>

          <form onSubmit={submit} className="glass-panel chrome-stroke interactive-panel micro-reveal rounded-3xl p-5 sm:p-8 md:col-span-4 space-y-3" style={{ animationDelay: '140ms' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <Input
                required
                placeholder={locale === 'fr' ? 'Nom' : 'Name'}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Input
              required
              placeholder={locale === 'fr' ? 'Sujet' : 'Subject'}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Textarea
              required
              placeholder={locale === 'fr' ? 'Votre message' : 'Your message'}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <Button disabled={sending} type="submit">
              {sending ? (locale === 'fr' ? 'Envoi...' : 'Sending...') : (locale === 'fr' ? 'Envoyer' : 'Send')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
