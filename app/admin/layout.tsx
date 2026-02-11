'use client';

import React from 'react';
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin - Kelola Gambar & Client</h1>
      <div className="lg:flex lg:gap-8">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
