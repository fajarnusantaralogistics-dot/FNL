'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = (searchParams?.get('section') as 'overview' | 'clients' | 'gallery' | 'testimonials' | 'profile') || 'overview';

  const navigate = (s: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('section', s);
    router.push(`/admin?${params.toString()}`);
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
