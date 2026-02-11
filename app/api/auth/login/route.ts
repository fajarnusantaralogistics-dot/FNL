import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });

    const user = await (prisma as any).user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookies.set('token', String(user.id), { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, secure: isProd, sameSite: 'lax' });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
