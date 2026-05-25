import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Mengambil semua data Role
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data Role' }, { status: 500 });
  }
}

// POST: Membuat Role Baru
export async function POST(request: Request) {
  try {
    const { name, permissions } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Nama Role wajib diisi' }, { status: 400 });
    }

    // Cek apakah nama role sudah ada
    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return NextResponse.json({ message: 'Nama Role sudah digunakan' }, { status: 400 });
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        permissions, // Prisma otomatis menyimpan objek ini sebagai JSON
      },
    });

    return NextResponse.json({ message: 'Role berhasil ditambahkan', role: newRole });
  } catch (error) {
    console.error("Create Role Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}