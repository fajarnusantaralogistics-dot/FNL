import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  // Note: routes will return 500 if env not set when called.
}

function sha1(input: string) {
  return crypto.createHash('sha1').update(input).digest('hex');
}

const DATABASE_URL = process.env.DATABASE_URL;
let prisma: PrismaClient | null = null;

function getPrisma() {
  if (!DATABASE_URL) return null;
  if (prisma) return prisma;
  prisma = new PrismaClient();
  return prisma;
}

export async function GET(req: Request) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'CLOUDINARY env variables not set' }, { status: 500 });
  }

  try {
    const urlObj = new URL(req.url);
    const category = urlObj.searchParams.get('category');

    // Try DB first (Prisma + Neon/Postgres)
    const prismaClient = getPrisma();
    if (prismaClient) {
      const rows = await prismaClient.image.findMany({
        where: category ? { category } : undefined,
        orderBy: { createdAt: 'desc' },
        select: { publicId: true, url: true }
      });
      if (rows && rows.length > 0) {
        return NextResponse.json({ resources: rows.map((r: any) => ({ public_id: r.publicId, secure_url: r.url })) });
      }
    }

    // Fallback to Cloudinary direct listing if DB empty or not configured
    const prefixParam = category ? `&prefix=${encodeURIComponent(category)}` : '';
    const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=200${prefixParam}`;
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    const res = await fetch(apiUrl, { headers: { Authorization: `Basic ${auth}` } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'CLOUDINARY env variables not set' }, { status: 500 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });

    const timestamp = Math.floor(Date.now() / 1000);
    // accept optional folder/category
    const category = (form.get('category') as string) || (form.get('folder') as string) || '';
    // Cloudinary signature must include any params (like folder) used during upload
    const signaturePayload = category ? `folder=${category}&timestamp=${timestamp}` : `timestamp=${timestamp}`;
    const signature = sha1(`${signaturePayload}${API_SECRET}`);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob([await file.arrayBuffer()]), file.name);
    uploadForm.append('api_key', API_KEY);
    uploadForm.append('timestamp', String(timestamp));
    uploadForm.append('signature', signature);
    if (category) uploadForm.append('folder', category);

    const r = await fetch(uploadUrl, { method: 'POST', body: uploadForm });
    const data = await r.json();

    // persist metadata to DB (if enabled)
    try {
      const prismaClient = getPrisma();
      if (prismaClient && data && data.public_id) {
        const imgUrl = data.secure_url || data.url || data.secure_url;
        await prismaClient.image.upsert({
          where: { publicId: data.public_id },
          update: { url: imgUrl, category: category || null },
          create: { publicId: data.public_id, url: imgUrl, category: category || null }
        });
      }
    } catch (e) {
      console.error('DB save error', e);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'CLOUDINARY env variables not set' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { public_id } = body || {};
    if (!public_id) return NextResponse.json({ error: 'public_id required' }, { status: 400 });

    const timestamp = Math.floor(Date.now() / 1000);
    // signature requires sorted params (public_id then timestamp)
    const signature = sha1(`public_id=${public_id}&timestamp=${timestamp}${API_SECRET}`);

    const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
    const params = new URLSearchParams();
    params.append('public_id', public_id);
    params.append('api_key', API_KEY);
    params.append('timestamp', String(timestamp));
    params.append('signature', signature);

    const r = await fetch(destroyUrl, { method: 'POST', body: params });
    const data = await r.json();

    // remove from DB if exists
    try {
      const prismaClient = getPrisma();
      if (prismaClient) {
        await prismaClient.image.delete({ where: { publicId: public_id } });
      }
    } catch (e) {
      console.error('DB delete error', e);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}
