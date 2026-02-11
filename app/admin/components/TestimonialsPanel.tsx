'use client';

import React from 'react';

export default function TestimonialsPanel(props: {
  testimonials: any[];
  name: string;
  setName: (s: string) => void;
  position: string;
  setPosition: (s: string) => void;
  company: string;
  setCompany: (s: string) => void;
  testimonial: string;
  setTestimonial: (s: string) => void;
  uploadTestimonial: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  removeTestimonial: (id: number) => Promise<void>;
  editId?: number | null;
  setEditId?: (id: number | null) => void;
}) {
  const { testimonials, name, setName, position, setPosition, company, setCompany, testimonial, setTestimonial, uploadTestimonial, loading, removeTestimonial, setEditId = (() => {}) as any } = props;

  return (
    <div>
      <section className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Tambah Testimonial</h3>
        <form onSubmit={uploadTestimonial} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input aria-label="Nama" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" className="border px-3 py-2 rounded w-full" />
          <input aria-label="Jabatan" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Jabatan (opsional)" className="border px-3 py-2 rounded w-full" />
          <input aria-label="Perusahaan" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Perusahaan (opsional)" className="border px-3 py-2 rounded w-full" />
          <textarea aria-label="Testimonial" value={testimonial} onChange={(e) => setTestimonial(e.target.value)} placeholder="Tulis testimonial di sini..." className="border px-3 py-2 rounded col-span-1 sm:col-span-3 w-full h-28 resize-none" />
          <div className="flex justify-end sm:col-span-3">
            <button type="submit" disabled={loading || !name || !testimonial} className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-60">{loading ? 'Menyimpan...' : 'Tambah Testimonial'}</button>
          </div>
        </form>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Daftar Testimonial</h3>
        <div className="space-y-4">
          {testimonials.length === 0 && <div className="text-gray-500">Belum ada testimonial.</div>}
          {testimonials.map((t) => (
            <div key={t.id} className="border p-4 rounded flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-semibold">{(t.name || 'U').split(' ').map((s: string) => s[0]).slice(0,2).join('')}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.position}{t.position && t.company ? ' • ' : ''}{t.company}</div>
                </div>
                <blockquote className="mt-2 text-sm text-gray-800 italic">“{t.testimonial}”</blockquote>
                <div className="mt-3 flex gap-4">
                  <button onClick={() => { setName(t.name); setPosition(t.position || ''); setCompany(t.company || ''); setTestimonial(t.testimonial); setEditId(t.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sky-600 hover:underline">Edit</button>
                  <button onClick={() => removeTestimonial(t.id)} className="text-red-600 hover:underline">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
