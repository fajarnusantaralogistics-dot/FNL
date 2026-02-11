import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function sha1(input: string) {
  return crypto.createHash('sha1').update(input).digest('hex');
}

function getPrisma() {
  // lazy init
  return new PrismaClient();
}

export async function GET(req: Request) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return NextResponse.json({ error: 'cloudinary env not set' }, { status: 500 });

  try {
    const prisma = getPrisma();
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const where = category ? { category } : undefined;
    const clients = await prisma.client.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ clients });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return NextResponse.json({ error: 'cloudinary env not set' }, { status: 500 });

  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const name = (form.get('name') as string) || '';
    const website = (form.get('website') as string) || null;
    const category = (form.get('category') as string) || null;
    if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'clients';
    const signature = sha1(`folder=${folder}&timestamp=${timestamp}${API_SECRET}`);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob([await file.arrayBuffer()]), file.name);
    uploadForm.append('api_key', API_KEY);
    uploadForm.append('timestamp', String(timestamp));
    uploadForm.append('signature', signature);
    uploadForm.append('folder', folder);

    const r = await fetch(uploadUrl, { method: 'POST', body: uploadForm });
    const data = await r.json();
    if (!data || !data.public_id) return NextResponse.json({ error: 'upload failed', details: data }, { status: 500 });

    const prisma = getPrisma();
    const created = await prisma.client.create({ data: { name, website, category, logoPublic: data.public_id, logoUrl: data.secure_url || data.url } });

    return NextResponse.json({ ok: true, client: created });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return NextResponse.json({ error: 'cloudinary env not set' }, { status: 500 });

  try {
    const body = await req.json();
    const { logoPublic } = body || {};
    if (!logoPublic) return NextResponse.json({ error: 'logoPublic required' }, { status: 400 });

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = sha1(`public_id=${logoPublic}&timestamp=${timestamp}${API_SECRET}`);

    const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
    const params = new URLSearchParams();
    params.append('public_id', logoPublic);
    params.append('api_key', API_KEY);
    params.append('timestamp', String(timestamp));
    params.append('signature', signature);

    const r = await fetch(destroyUrl, { method: 'POST', body: params });
    const data = await r.json();

    const prisma = getPrisma();
    await prisma.client.deleteMany({ where: { logoPublic } });

    return NextResponse.json({ ok: true, result: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}
