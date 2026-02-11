'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [from, setFrom] = useState('/admin');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const f = new URLSearchParams(window.location.search).get('from');
    if (f) setFrom(f);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (res.ok) {
        router.push(from);
      } else {
        const d = await res.json();
        setError(d?.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        {error ? <div className="mb-3 text-red-600">{error}</div> : null}
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border px-3 py-2 rounded" />
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded">{loading ? 'Mengautentikasi...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
