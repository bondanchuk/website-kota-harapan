export const dynamic = 'force-dynamic'; 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function GET() {
  try {
    const agendas = await prisma.agenda.findMany({
      where: { status: 'publish' },
      orderBy: { eventDate: 'asc' } // Urutkan dari jadwal terdekat
    });
    return NextResponse.json(agendas);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memuat agenda publik' }, { status: 500 });
  }
}