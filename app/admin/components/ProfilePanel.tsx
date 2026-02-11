"use client";

import React, { useEffect, useState } from 'react';

export default function ProfilePanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/validate');
        if (res.ok) {
          const d = await res.json();
          setEmail(d.user?.email || '');
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (password && password !== confirm) {
      setMessage({ type: 'error', text: 'Password confirmation does not match' });
      return;
    }
    setLoading(true);
    try {
      const body: any = { email };
      if (password) body.password = password;
      const res = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await res.json();
      if (res.ok) setMessage({ type: 'success', text: 'Profile updated' });
      else setMessage({ type: 'error', text: d?.error || 'Failed to update profile' });
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Network error' });
    } finally {
      setLoading(false);
      setPassword('');
      setConfirm('');
      setTimeout(() => setMessage(null), 3500);
    }
  }

  return (
    <div className="bg-white rounded shadow p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Profil Admin</h2>
      {message ? <div className={`p-2 mb-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div> : null}
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <div className="text-sm mb-1">Email</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </label>
        <label className="block">
          <div className="text-sm mb-1">New password (leave blank to keep)</div>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" />
        </label>
        <label className="block">
          <div className="text-sm mb-1">Confirm password</div>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" />
        </label>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
