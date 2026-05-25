// KUNCI PERBAIKAN: Memaksa Next.js untuk selalu mengambil data terbaru secara real-time (tanpa cache)
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    // 1. Ambil 4 Berita Terbaru (DARI SEMUA KATEGORI YANG BERSTATUS PUBLISH)
    const terbaru = await prisma.blogPost.findMany({
      where: {
        status: 'publish' 
        // Filter spesifik kategori telah dihapus agar sistem lebih fleksibel.
        // Apapun kategorinya, asal baru dipublish, akan masuk ke Berita Terkini.
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' }, // Diurutkan dari yang paling baru
      take: 4 
    });

    // 2. Ambil 5 Berita Terpopuler berdasarkan jumlah views terbanyak
    const terpopuler = await prisma.blogPost.findMany({
      where: { status: 'publish' },
      include: { category: true },
      orderBy: { views: 'desc' },
      take: 5 
    });

    return NextResponse.json({ terbaru, terpopuler });
  } catch (error) {
    console.error("Public News API Error:", error);
    return NextResponse.json({ message: 'Gagal memuat data berita publik' }, { status: 500 });
  }
}