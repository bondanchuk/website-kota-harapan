import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// GET: Ambil semua kategori
export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil kategori' }, { status: 500 });
  }
}

// POST: Tambah kategori baru
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ message: 'Nama kategori wajib diisi' }, { status: 400 });

    // Otomatis membuat Slug (URL-friendly) dari nama kategori
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Cek apakah kategori sudah ada
    const existing = await prisma.blogCategory.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ message: 'Kategori ini sudah terdaftar' }, { status: 400 });

    const newCategory = await prisma.blogCategory.create({
      data: { name, slug }
    });

    return NextResponse.json({ message: 'Kategori ditambahkan', category: newCategory });
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}