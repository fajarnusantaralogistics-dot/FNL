import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

function parseTokenFromHeader(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

export async function PUT(req: Request) {
  try {
    const token = parseTokenFromHeader(req);
    if (!token) return NextResponse.json({ error: 'Tidak terotorisasi' }, { status: 401 });
    const id = Number(token);
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Tidak terotorisasi' }, { status: 401 });

    const body = await req.json();
    const { email, password } = body || {};
    const data: any = {};
    if (email) data.email = email;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      data.passwordHash = hash;
    }

    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Tidak ada perubahan yang diberikan' }, { status: 400 });

    try {
      const user = await (prisma as any).user.update({ where: { id }, data });
      return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err: any) {
      // unique constraint on email
      const message = String(err?.message || err);
      if (message.includes('Unique') || message.includes('unique')) return NextResponse.json({ error: 'Email sudah digunakan' }, { status: 400 });
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
