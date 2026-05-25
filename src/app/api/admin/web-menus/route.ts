import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { revalidatePath } from 'next/cache'; // Kunci untuk sinkronisasi seketika

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    // Mengambil menu utama (yang tidak punya parent) beserta sub-menunya
    const menus = await prisma.webMenu.findMany({
      where: { parentId: null },
      include: {
        subMenus: {
          orderBy: { order: 'asc' } // Urutkan sub-menu
        }
      },
      orderBy: { order: 'asc' } // Urutkan menu utama
    });
    return NextResponse.json(menus);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memuat struktur menu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, url, order, parentId } = await request.json();

    if (!title) {
      return NextResponse.json({ message: 'Judul menu wajib diisi' }, { status: 400 });
    }

    const newMenu = await prisma.webMenu.create({
      data: {
        title,
        url: url || '#',
        order: Number(order) || 0,
        parentId: parentId || null // Jika kosong, berarti ini Menu Utama
      }
    });

    // Sinkronisasi Instan: Hapus cache layout utama frontend agar menu langsung berubah!
    revalidatePath('/', 'layout');

    return NextResponse.json({ message: 'Menu berhasil ditambahkan', menu: newMenu });
  } catch (error) {
    console.error("Create Menu Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}