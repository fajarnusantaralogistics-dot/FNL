'use client';

import React, { useEffect, useState } from 'react';
import OverviewPanel from './components/OverviewPanel';
import ClientsPanel from './components/ClientsPanel';
import GalleryPanel from './components/GalleryPanel';
import TestimonialsPanel from './components/TestimonialsPanel';
import ProfilePanel from './components/ProfilePanel';

type CloudItem = { name: string; url: string; public_id: string };

export default function AdminPage() {
  const [cloudItems, setCloudItems] = useState<CloudItem[]>([]);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>('all');
  const [section, setSection] = useState<'overview' | 'clients' | 'gallery' | 'testimonials' | 'profile'>('overview');

  useEffect(() => {
    function readSection() {
      if (typeof window === 'undefined') return;
      const sp = new URLSearchParams(window.location.search).get('section') as
        | 'overview'
        | 'clients'
        | 'gallery'
        | 'testimonials'
        | 'profile'
        | null;
      if (sp) setSection(sp);
      else setSection('overview');
    }
    (function patchHistoryOnce() {
      if (typeof window === 'undefined' || (window as any).__patchedHistory) return;
      const _push = history.pushState;
      history.pushState = function (this: any, ...args: any[]) {
        const res = _push.apply(this, args as any);
        try {
          queueMicrotask(() => window.dispatchEvent(new Event('locationchange')));
        } catch (e) {
          setTimeout(() => window.dispatchEvent(new Event('locationchange')));
        }
        return res;
      } as any;
      const _replace = history.replaceState;
      history.replaceState = function (this: any, ...args: any[]) {
        const res = _replace.apply(this, args as any);
        try {
          queueMicrotask(() => window.dispatchEvent(new Event('locationchange')));
        } catch (e) {
          setTimeout(() => window.dispatchEvent(new Event('locationchange')));
        }
        return res;
      } as any;
      (window as any).__patchedHistory = true;
    })();

    readSection();
    const onLocationChange = () => readSection();
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('locationchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('locationchange', onLocationChange);
    };
  }, []);

  // clients state
  const [clients, setClients] = useState<{ id: number; name: string; website?: string; logoUrl: string; logoPublic: string; category?: string }[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientWebsite, setClientWebsite] = useState('');
  const [clientFile, setClientFile] = useState<File | null>(null);
  const [clientCategory, setClientCategory] = useState<'all' | 'corporate' | 'otomotif' | 'property'>('all');
  const [clientFormCategory, setClientFormCategory] = useState<'corporate' | 'otomotif' | 'property'>('corporate');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // testimonials state
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialPosition, setTestimonialPosition] = useState('');
  const [testimonialCompany, setTestimonialCompany] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);

  const CATEGORIES = [
    { value: 'all', label: 'Semua' },
    { value: 'kendaraan', label: 'Kendaraan' },
    { value: 'barang', label: 'Barang' },
    { value: 'alat_berat', label: 'Alat Berat' },
    { value: 'kapal', label: 'Kapal' },
  ];

  async function load() {
    const q = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`/api/cloudinary${q}`);
    const data = await res.json();
    const items = (data.resources || []).map((r: any) => ({
      name: r.public_id,
      url: r.secure_url,
      public_id: r.public_id,
    }));
    setCloudItems(items || []);
  }

  async function loadClients() {
    const q = clientCategory && clientCategory !== 'all' ? `?category=${encodeURIComponent(clientCategory)}` : '';
    const res = await fetch(`/api/clients${q}`);
    const data = await res.json();
    setClients(data.clients || []);
  }

  async function loadTestimonials() {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : data.testimonials || []);
    } catch (e) {
      setTestimonials([]);
    }
  }

  // overview stats
  const [overview, setOverview] = useState<{ clients: number; images: number }>({ clients: 0, images: 0 });
  async function loadOverview() {
    try {
      const c = await fetch('/api/clients');
      const cd = await c.json();
      const clientsCount = (cd.clients || []).length;
      const ci = await fetch('/api/cloudinary');
      const id = await ci.json();
      const imagesCount = (id.resources || []).length;
      setOverview({ clients: clientsCount, images: imagesCount });
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    loadClients();
  }, [clientCategory]);

  useEffect(() => {
    load();
    loadClients();
    loadOverview();
    loadTestimonials();
  }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!fileInput) return;
    setLoading(true);
    const form = new FormData();
    form.append('file', fileInput);
    if (category && category !== 'all') form.append('category', category);
    await fetch('/api/cloudinary', { method: 'POST', body: form });
    await load();
    setFileInput(null);
    setLoading(false);
  }

  async function uploadClient(e: React.FormEvent) {
    e.preventDefault();
    if (!clientFile || !clientName) {
      setAlert({ type: 'error', text: 'Nama dan file logo diperlukan' });
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append('file', clientFile);
    form.append('name', clientName);
    if (clientWebsite) form.append('website', clientWebsite);
    form.append('category', clientFormCategory);
    try {
      const res = await fetch('/api/clients', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) setAlert({ type: 'success', text: 'Client berhasil ditambahkan' });
      else setAlert({ type: 'error', text: data?.error || 'Gagal menambahkan client' });
    } catch (e: any) {
      setAlert({ type: 'error', text: e?.message || 'Network error' });
    } finally {
      setLoading(false);
      setClientFile(null);
      setClientName('');
      setClientWebsite('');
      setClientFormCategory('corporate');
      await loadClients();
      setTimeout(() => setAlert(null), 3500);
    }
  }

  async function uploadTestimonial(e: React.FormEvent) {
    e.preventDefault();
    if (!testimonialName || !testimonialText) {
      setAlert({ type: 'error', text: 'Nama dan testimonial diperlukan' });
      return;
    }
    setLoading(true);
    try {
      const method = editingTestimonialId ? 'PUT' : 'POST';
      const body = editingTestimonialId ? { id: editingTestimonialId, name: testimonialName, position: testimonialPosition, company: testimonialCompany, testimonial: testimonialText } : { name: testimonialName, position: testimonialPosition, company: testimonialCompany, testimonial: testimonialText };
      const res = await fetch('/api/testimonials', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) setAlert({ type: 'success', text: 'Testimonial berhasil ditambahkan' });
      else setAlert({ type: 'error', text: data?.error || 'Gagal menambahkan testimonial' });
    } catch (e: any) {
      setAlert({ type: 'error', text: e?.message || 'Network error' });
    } finally {
      setLoading(false);
      setTestimonialName('');
      setTestimonialPosition('');
      setTestimonialCompany('');
      setTestimonialText('');
      setEditingTestimonialId(null);
      await loadTestimonials();
      setTimeout(() => setAlert(null), 3500);
    }
  }

  async function removeTestimonial(id: number) {
    if (!confirm('Hapus testimonial ini?')) return;
    await fetch('/api/testimonials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (editingTestimonialId === id) setEditingTestimonialId(null);
    await loadTestimonials();
  }

  async function removeClient(logoPublic: string) {
    if (!confirm(`Hapus client dengan logo ${logoPublic}?`)) return;
    await fetch('/api/clients', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logoPublic }) });
    await loadClients();
  }

  async function remove(public_id: string) {
    if (!confirm(`Hapus ${public_id}?`)) return;
    await fetch('/api/cloudinary', { method: 'DELETE', body: JSON.stringify({ public_id }), headers: { 'Content-Type': 'application/json' } });
    await load();
  }


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin - Kelola Gambar & Client</h1>

      <div className="mb-4">
        {alert ? (
          <div className={`p-3 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{alert.text}</div>
        ) : null}
      </div>

      {section === 'overview' && <OverviewPanel overview={overview} recentClients={clients} />}
      {section === 'clients' && (
        <ClientsPanel
          clients={clients}
          clientCategory={clientCategory}
          setClientCategory={(s) => setClientCategory(s as any)}
          clientFormCategory={clientFormCategory}
          setClientFormCategory={(s) => setClientFormCategory(s as any)}
          onFileChange={(f) => setClientFile(f)}
          clientFile={clientFile}
          clientName={clientName}
          setClientName={(s) => setClientName(s)}
          clientWebsite={clientWebsite}
          setClientWebsite={(s) => setClientWebsite(s)}
          uploadClient={uploadClient}
          loading={loading}
          removeClient={removeClient}
        />
      )}

      {section === 'gallery' && (
        <GalleryPanel
          cloudItems={cloudItems}
          onFileChange={(f) => setFileInput(f)}
          fileInput={fileInput}
          category={category}
          setCategory={(s) => setCategory(s)}
          upload={upload}
          remove={remove}
          loading={loading}
          CATEGORIES={CATEGORIES}
        />
      )}
      {section === 'testimonials' && (
        <TestimonialsPanel
          testimonials={testimonials}
          name={testimonialName}
          setName={(s) => setTestimonialName(s)}
          position={testimonialPosition}
          setPosition={(s) => setTestimonialPosition(s)}
          company={testimonialCompany}
          setCompany={(s) => setTestimonialCompany(s)}
          testimonial={testimonialText}
          setTestimonial={(s) => setTestimonialText(s)}
          uploadTestimonial={uploadTestimonial}
          loading={loading}
          removeTestimonial={removeTestimonial}
          editId={editingTestimonialId}
          setEditId={(id: number | null) => setEditingTestimonialId(id)}
        />
      )}
      {section === 'profile' && (
        // lazy-load profile panel
        <div className="mt-6">
          {/* import client component dynamically */}
          <React.Suspense fallback={<div>Loading profile…</div>}>
            {/* @ts-ignore */}
            <ProfilePanel />
          </React.Suspense>
        </div>
      )}
    </div>
  );
}
