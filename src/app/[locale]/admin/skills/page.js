"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name_en: '', name_fr: '', category: '', level: '', displayOrder: 1 });

  async function load() {
    const res = await fetch('/api/admin/skills');
    if (res.ok) setSkills(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    const res = await fetch('/api/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name_en: '', name_fr: '', category: '', level: '', displayOrder: 1 });
      load();
    }
  }

  async function remove(id) {
    await fetch('/api/admin/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function edit(skill) {
    const name_en = prompt('English name', skill.name_en) || skill.name_en;
    const name_fr = prompt('French name', skill.name_fr) || skill.name_fr;
    const category = prompt('Category', skill.category || '') || '';
    const level = prompt('Level', skill.level || '') || '';

    await fetch('/api/admin/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: skill.id, name_en, name_fr, category, level }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Skills</h1>
      <form className="grid grid-cols-1 md:grid-cols-5 gap-3" onSubmit={add}>
        <Input required placeholder="Name (EN)" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
        <Input required placeholder="Name (FR)" value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} />
        <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Input placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
        <Button type="submit">Add Skill</Button>
      </form>

      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.id} className="p-3 border rounded flex justify-between items-center">
            <div>{skill.name_en} / {skill.name_fr}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => edit(skill)}>Edit</Button>
              <Button variant="destructive" onClick={() => remove(skill.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
