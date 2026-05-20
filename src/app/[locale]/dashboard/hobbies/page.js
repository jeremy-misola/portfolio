"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function HobbiesAdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name_en: '', name_fr: '', description_en: '', description_fr: '' });

  async function load() {
    const res = await fetch('/api/admin/hobbies');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    const res = await fetch('/api/admin/hobbies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name_en: '', name_fr: '', description_en: '', description_fr: '' });
      load();
    }
  }

  async function remove(id) {
    await fetch('/api/admin/hobbies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function edit(item) {
    const name_en = prompt('Name (EN)', item.name_en) || item.name_en;
    const name_fr = prompt('Name (FR)', item.name_fr) || item.name_fr;
    const description_en = prompt('Description (EN)', item.description_en || '') || '';
    const description_fr = prompt('Description (FR)', item.description_fr || '') || '';

    await fetch('/api/admin/hobbies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, name_en, name_fr, description_en, description_fr }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Hobbies</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={add}>
        <Input required placeholder="Name (EN)" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
        <Input required placeholder="Name (FR)" value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} />
        <Textarea placeholder="Description (EN)" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
        <Textarea placeholder="Description (FR)" value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} />
        <Button type="submit">Add Hobby</Button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="p-3 border rounded flex justify-between items-center">
            <div>{item.name_en} / {item.name_fr}</div>
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
