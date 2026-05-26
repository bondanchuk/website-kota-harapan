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
    const sliders = await prisma.slider.findMany({
      where: { status: 'publish' },
      orderBy: { order: 'asc' } // Diurutkan berdasarkan angka 'urutan tampil'
    });
    return NextResponse.json(sliders);
  } catch (error) {
    console.error("Public Sliders API Error:", error);
    return NextResponse.json({ message: 'Gagal memuat slider publik' }, { status: 500 });
  }
}