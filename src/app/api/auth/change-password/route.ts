import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const { oldPassword, newPassword, confirmPassword } = await request.json();

    // 1. Validasi Kombinasi Keamanan Password Baru (Regex)
    // Syarat: Minimal 6 karakter, ada 1 huruf kecil, 1 huruf besar, dan 1 angka
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { message: 'Password baru harus minimal 6 karakter, mengandung huruf besar, huruf kecil, dan angka.' },
        { status: 400 }
      );
    }

    // 2. Validasi kesamaan password baru
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: 'Konfirmasi password baru tidak cocok' }, { status: 400 });
    }

    // 3. Ambil sesi dari Cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get('admin_session')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Sesi telah habis, silakan login ulang' }, { status: 401 });
    }

    // 4. Cari user di database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'Akun tidak ditemukan' }, { status: 404 });
    }

    // 5. Verifikasi password lama
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return NextResponse.json({ message: 'Password lama Anda salah!' }, { status: 401 });
    }

    // 6. Enkripsi (Hash) password baru dan simpan ke database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    // 7. Hapus cookie sesi agar pengguna langsung logout
    const response = NextResponse.json({ message: 'Password berhasil diubah!' });
    response.cookies.delete('admin_session');

    return response;

  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}