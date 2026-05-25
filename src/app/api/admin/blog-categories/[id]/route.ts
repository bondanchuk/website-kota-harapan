import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// PUT: Ubah nama kategori
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { name } = await request.json();
    
    if (!name) return NextResponse.json({ message: 'Nama kategori wajib diisi' }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Cek duplikasi dengan kategori lain (kecuali yang sedang diedit)
    const existing = await prisma.blogCategory.findFirst({ 
      where: { slug, NOT: { id: resolvedParams.id } } 
    });
    if (existing) return NextResponse.json({ message: 'Kategori dengan nama/slug ini sudah ada' }, { status: 400 });

    const updatedCategory = await prisma.blogCategory.update({
      where: { id: resolvedParams.id },
      data: { name, slug }
    });

    return NextResponse.json({ message: 'Kategori diperbarui', category: updatedCategory });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui kategori' }, { status: 500 });
  }
}

// DELETE: Hapus kategori
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    // Catatan: Nanti saat modul Blog Post jadi, kita bisa tambahkan proteksi agar kategori yang punya berita tidak bisa dihapus
    await prisma.blogCategory.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ message: 'Kategori dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus kategori' }, { status: 500 });
  }
}