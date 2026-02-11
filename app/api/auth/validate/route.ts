import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )token=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const id = Number(token);
    if (Number.isNaN(id)) return NextResponse.json({ ok: false }, { status: 401 });

    const user = await (prisma as any).user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
