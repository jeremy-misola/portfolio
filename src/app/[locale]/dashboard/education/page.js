"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function EducationAdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    school: '', location: '', degree_en: '', degree_fr: '', startDate: '', endDate: '', description_en: '', description_fr: ''
  });

  async function load() {
    const res = await fetch('/api/admin/education');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    const res = await fetch('/api/admin/education', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ school: '', location: '', degree_en: '', degree_fr: '', startDate: '', endDate: '', description_en: '', description_fr: '' });
      load();
    }
  }

  async function remove(id) {
    await fetch('/api/admin/education', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function edit(item) {
    const school = prompt('School', item.school) || item.school;
    const degree_en = prompt('Degree (EN)', item.degree_en) || item.degree_en;
    const degree_fr = prompt('Degree (FR)', item.degree_fr) || item.degree_fr;
    const location = prompt('Location', item.location || '') || '';

    await fetch('/api/admin/education', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item.id,
        school,
        degree_en,
        degree_fr,
        location,
        startDate: item.startDate,
        endDate: item.endDate,
        description_en: item.description_en,
        description_fr: item.description_fr,
      }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Education</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={add}>
        <Input required placeholder="School" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
        <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <Input required placeholder="Degree (EN)" value={form.degree_en} onChange={(e) => setForm({ ...form, degree_en: e.target.value })} />
        <Input required placeholder="Degree (FR)" value={form.degree_fr} onChange={(e) => setForm({ ...form, degree_fr: e.target.value })} />
        <Input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        <Textarea placeholder="Description (EN)" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
        <Textarea placeholder="Description (FR)" value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} />
        <Button type="submit">Add Education</Button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="p-3 border rounded flex justify-between items-center">
            <div>{item.school} - {item.degree_en}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => edit(item)}>Edit</Button>
              <Button variant="destructive" onClick={() => remove(item.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
