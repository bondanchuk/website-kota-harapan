import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

// 1. Konfigurasi Kredensial & Adapter PostgreSQL untuk Prisma v7+
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Masukkan adapter ke dalam konstruktor utama Prisma
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 3. Cari user berdasarkan username di database PostgreSQL
    const user = await prisma.user.findUnique({
      where: { username },
      include: { role: true } // Wajib tambahkan include ini
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Kombinasi nama pengguna atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    // 4. Cocokkan password input dengan hash password di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Kombinasi nama pengguna atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    // 5. Autentikasi Berhasil
    // 5. Autentikasi Berhasil
    const response = NextResponse.json({
      message: 'Login berhasil',
      user: { id: user.id, username: user.username, role: user.role.name },
    });

    // Tanamkan Cookie Sesi (HTTP-Only agar aman dari serangan XSS)
    response.cookies.set({
      name: 'admin_session',
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // Sesi berlaku 1 hari
    });

    return response;

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal pada server backend' },
      { status: 500 }
    );
  }
}