import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// PUT: Memperbarui data pengguna berdasarkan ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { name, username, email, password, roleId, status } = await request.json();

    // Ambil data user yang asli untuk proteksi
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (targetUser?.username === 'admin_kepri' && username !== 'admin_kepri') {
      return NextResponse.json({ message: 'Username Super Admin utama tidak boleh diganti' }, { status: 403 });
    }

    let updateData: any = {
      name,
      username,
      email,
      roleId,
      status: Boolean(status)
    };

    // Jika admin mengisi kolom password baru, lakukan validasi dan enkripsi ulang
    if (password && password.trim() !== '') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        return NextResponse.json({ message: 'Sandi baru harus minimal 6 karakter dengan huruf besar, kecil, dan angka' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: 'Data pengguna berhasil diperbarui', user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json({ message: 'Gagal memperbarui data pengguna' }, { status: 500 });
  }
}

// DELETE: Menghapus data pengguna dari sistem
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    
    // Proteksi Keamanan: Jangan izinkan menghapus akun Super Admin utama sistem
    if (targetUser?.username === 'admin_kepri') {
      return NextResponse.json({ message: 'Akun inti Super Admin tidak dapat dihapus!' }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ message: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}