import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { promises as fs } from 'fs'; // <-- PERBAIKAN IMPORT DI SINI
import path from 'path';
import { revalidatePath } from 'next/cache';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function GET() {
  try {
    const pages = await prisma.webPage.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const contentEn = formData.get('contentEn') as string;
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    if (!title) return NextResponse.json({ message: 'Judul wajib diisi' }, { status: 400 });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await prisma.webPage.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ message: 'Halaman dengan judul ini sudah ada!' }, { status: 400 });

    let imagePath = null;
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      
      await fs.writeFile(filepath, buffer); // <-- PERBAIKAN PENGGUNAAN DI SINI
      imagePath = `/uploads/${filename}`;
    }

    const newPage = await prisma.webPage.create({
      data: { title, slug, content, contentEn, status, image: imagePath }
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Halaman berhasil dibuat', page: newPage });
  } catch (error) {
    console.error("ERROR DATABASE PAGES:", error); // <-- Tambahkan baris ini
    return NextResponse.json({ message: 'Error fetching pages' }, { status: 500 });
  }
}