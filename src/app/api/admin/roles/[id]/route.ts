import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// PUT: Memperbarui data Role berdasarkan ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // KUNCI PERBAIKAN: Tunggu (await) params sebelum membaca id-nya
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { name, permissions } = await request.json();

    // Proteksi Keamanan: Jangan izinkan mengubah Role 'Super Admin' bawaan seed
    const targetRole = await prisma.role.findUnique({ where: { id } });
    if (targetRole?.name === 'Super Admin') {
      return NextResponse.json({ message: 'Role Super Admin inti sistem tidak dapat dimodifikasi' }, { status: 403 });
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: { name, permissions },
    });

    return NextResponse.json({ message: 'Role berhasil diperbarui', role: updatedRole });
  } catch (error) {
    console.error("Update Role Error:", error);
    return NextResponse.json({ message: 'Gagal memperbarui data Role' }, { status: 500 });
  }
}

// DELETE: Menghapus data Role berdasarkan ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // KUNCI PERBAIKAN: Tunggu (await) params sebelum membaca id-nya
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Proteksi Keamanan 1: Jangan izinkan menghapus Role 'Super Admin'
    const targetRole = await prisma.role.findUnique({ where: { id } });
    if (targetRole?.name === 'Super Admin') {
      return NextResponse.json({ message: 'Role Super Admin inti sistem tidak dapat dihapus' }, { status: 403 });
    }

    // Proteksi Keamanan 2: Cek apakah ada user yang terikat dengan role ini
    const userCount = await prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      return NextResponse.json({ 
        message: 'Role ini tidak dapat dihapus karena masih digunakan oleh beberapa akun pengguna.' 
      }, { status: 400 });
    }

    await prisma.role.delete({ where: { id } });
    return NextResponse.json({ message: 'Role berhasil dihapus dari sistem' });
  } catch (error) {
    console.error("Delete Role Error:", error);
    return NextResponse.json({ message: 'Gagal menghapus data Role' }, { status: 500 });
  }
}