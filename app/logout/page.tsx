'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    }
    doLogout();
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Logging out...</div>;
}
