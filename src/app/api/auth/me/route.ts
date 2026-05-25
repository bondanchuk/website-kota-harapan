import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('admin_session')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Tidak ada sesi aktif' }, { status: 401 });
    }

    // Cari user di PostgreSQL berdasarkan ID dari cookie
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true } 
    });

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      user: { username: user.username, role: user.role.name } 
    });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memuat profil' }, { status: 500 });
  }
}