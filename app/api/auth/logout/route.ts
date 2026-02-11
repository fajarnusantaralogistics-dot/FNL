import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // clear cookie
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0, secure: isProd, sameSite: 'lax' });
  return res;
}
