"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState([]);

  async function load() {
    const res = await fetch('/api/admin/messages');
    if (res.ok) setMessages(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'read' }),
    });
    load();
  }

  async function remove(id) {
    await fetch('/api/admin/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contact Messages</h1>
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="border rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{msg.subject}</p>
              <p className="text-xs uppercase text-muted-foreground">{msg.status}</p>
            </div>
            <p className="text-sm">{msg.name} ({msg.email})</p>
            <p className="text-sm text-muted-foreground">{msg.message}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => markRead(msg.id)}>Mark Read</Button>
              <Button size="sm" variant="destructive" onClick={() => remove(msg.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
