"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsAdminPage() {
  const [form, setForm] = useState({
    fullName: '', headline_en: '', headline_fr: '', bio_en: '', bio_fr: '',
    resumeUrl: '', email: '', phone: '', location: '', linkedinUrl: '', githubUrl: ''
  });

  async function load() {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      const data = await res.json();
      setForm({ ...form, ...data });
    }
  }

  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Portfolio Settings</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={save}>
        <Input placeholder="Full name" value={form.fullName || ''} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <Input placeholder="Resume URL" value={form.resumeUrl || ''} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
        <Input placeholder="Headline (EN)" value={form.headline_en || ''} onChange={(e) => setForm({ ...form, headline_en: e.target.value })} />
        <Input placeholder="Headline (FR)" value={form.headline_fr || ''} onChange={(e) => setForm({ ...form, headline_fr: e.target.value })} />
        <Textarea placeholder="Bio (EN)" value={form.bio_en || ''} onChange={(e) => setForm({ ...form, bio_en: e.target.value })} />
        <Textarea placeholder="Bio (FR)" value={form.bio_fr || ''} onChange={(e) => setForm({ ...form, bio_fr: e.target.value })} />
        <Input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder="Location" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <Input placeholder="LinkedIn URL" value={form.linkedinUrl || ''} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
        <Input placeholder="GitHub URL" value={form.githubUrl || ''} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}
