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
    // Mengambil menu utama (Root) dan menyertakan Sub-Menu di dalamnya
    const menus = await prisma.webMenu.findMany({
      where: { parentId: null },
      include: {
        subMenus: {
          orderBy: { order: 'asc' } // Urutkan sub menu
        }
      },
      orderBy: { order: 'asc' } // Urutkan menu utama
    });
    return NextResponse.json(menus);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memuat menu publik' }, { status: 500 });
  }
}