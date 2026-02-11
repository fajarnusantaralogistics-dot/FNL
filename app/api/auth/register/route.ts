import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });

    const existing = await (prisma as any).user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);
    const created = await (prisma as any).user.create({ data: { email, passwordHash: hash, role: role || 'user' } });

    return NextResponse.json({ ok: true, user: { id: created.id, email: created.email } });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
