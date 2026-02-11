import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const imagesDir = path.join(process.cwd(), 'public', 'images');

export async function GET() {
  try {
    await fs.promises.mkdir(imagesDir, { recursive: true });
    const files = await fs.promises.readdir(imagesDir);
    return NextResponse.json({ files });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });

    const filename = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.promises.mkdir(imagesDir, { recursive: true });
    const dest = path.join(imagesDir, filename);
    await fs.promises.writeFile(dest, buffer);

    return NextResponse.json({ ok: true, filename });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { filename } = body || {};
    if (!filename) return NextResponse.json({ error: 'filename required' }, { status: 400 });

    const filePath = path.join(imagesDir, filename);
    await fs.promises.unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}
