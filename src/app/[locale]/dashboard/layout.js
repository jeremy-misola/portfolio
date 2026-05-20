"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayoutWrapper({ children }) {
  // The middleware handles authentication entirely, so we don't need client-side auth checks here
  return (
    <AdminLayout>
      {children}
      <Toaster />
    </AdminLayout>
  );
}
