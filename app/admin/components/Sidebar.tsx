'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const [section, setSection] = useState<'overview' | 'clients' | 'gallery' | 'testimonials' | 'profile'>('overview');

  // read search params from window on client to avoid useSearchParams SSR requirement
  useEffect(() => {
    function read() {
      try {
        const params = new URLSearchParams(window.location.search);
        const s = (params.get('section') as any) || 'overview';
        setSection(s);
      } catch (e) {
        setSection('overview');
      }
    }
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  const navigate = (s: string) => {
    // simple navigation, set section query param
    router.push(`/admin?section=${encodeURIComponent(s)}`);
    setSection(s as any);
    try {
      // inform other listeners (in case pushState doesn't trigger popstate)
      // dispatch asynchronously to avoid triggering updates inside insertion effects
      queueMicrotask(() => window.dispatchEvent(new Event('locationchange')));
    } catch (e) {
      setTimeout(() => window.dispatchEvent(new Event('locationchange')));
    }
  };

  return (
    <aside className="w-full lg:w-64 mb-6 lg:mb-0">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Admin</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => navigate('overview')} className={`text-left px-3 py-2 rounded ${section === 'overview' ? 'bg-sky-600 text-white' : 'hover:bg-slate-50'}`}>Overview</button>
          <button onClick={() => navigate('clients')} className={`text-left px-3 py-2 rounded ${section === 'clients' ? 'bg-sky-600 text-white' : 'hover:bg-slate-50'}`}>Clients</button>
          <button onClick={() => navigate('gallery')} className={`text-left px-3 py-2 rounded ${section === 'gallery' ? 'bg-sky-600 text-white' : 'hover:bg-slate-50'}`}>Gallery</button>
          <button onClick={() => navigate('testimonials')} className={`text-left px-3 py-2 rounded ${section === 'testimonials' ? 'bg-sky-600 text-white' : 'hover:bg-slate-50'}`}>Testimonials</button>
          <button onClick={() => navigate('profile')} className={`text-left px-3 py-2 rounded ${section === 'profile' ? 'bg-sky-600 text-white' : 'hover:bg-slate-50'}`}>Profile</button>
          <button onClick={() => router.push('/')} className="text-left px-3 py-2 rounded hover:bg-slate-50">Back to main page</button>
          <button onClick={() => router.push('/logout')} className="text-left px-3 py-2 rounded hover:bg-slate-50 text-red-600">Logout</button>
        </nav>
      </div>
    </aside>
  );
}
