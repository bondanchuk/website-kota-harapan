import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Mengambil semua data User terdaftar
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data Pengguna' }, { status: 500 });
  }
}

// POST: Membuat User / Akun Staf Baru
export async function POST(request: Request) {
  try {
    const { name, username, email, password, confirmPassword, roleId, status } = await request.json();

    if (!name || !username || !email || !password || !roleId) {
      return NextResponse.json({ message: 'Semua kolom wajib diisi!' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Konfirmasi kata sandi tidak cocok!' }, { status: 400 });
    }

    // Validasi Regex Kompleksitas Sandi (Huruf besar, huruf kecil, angka, min 6 karakter)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ message: 'Kata sandi harus minimal 6 karakter, mengandung huruf besar, huruf kecil, dan angka.' }, { status: 400 });
    }

    // Cek duplikasi username atau email
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });
    if (existingUser) {
      return NextResponse.json({ message: 'Nama pengguna atau Email sudah terdaftar!' }, { status: 400 });
    }

    // Hash kata sandi demi keamanan
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        roleId,
        status: Boolean(status)
      }
    });

    return NextResponse.json({ message: 'Pengguna berhasil didaftarkan', user: newUser });
  } catch (error) {
    console.error("Create User Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem server' }, { status: 500 });
  }
}