import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function getPrisma(): PrismaClient {
  if (global.__prisma) return global.__prisma;
  const prisma = new PrismaClient();
  global.__prisma = prisma;
  return prisma;
}

export async function GET() {
  try {
    const prisma = getPrisma();
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(testimonials);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name as string) || '';
    const position = (body.position as string) || null;
    const company = (body.company as string) || null;
    const testimonial = (body.testimonial as string) || '';

    if (!name || !testimonial) return NextResponse.json({ error: 'name and testimonial required' }, { status: 400 });

    const prisma = getPrisma();
    const created = await prisma.testimonial.create({ data: { name, position, company, testimonial } });
    return NextResponse.json(created);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body || {};
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const prisma = getPrisma();
    await prisma.testimonial.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body || {};
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const name = (body.name as string) || '';
    const position = (body.position as string) || null;
    const company = (body.company as string) || null;
    const testimonial = (body.testimonial as string) || '';

    if (!name || !testimonial) return NextResponse.json({ error: 'name and testimonial required' }, { status: 400 });

    const prisma = getPrisma();
    const updated = await prisma.testimonial.update({ where: { id }, data: { name, position, company, testimonial } });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
