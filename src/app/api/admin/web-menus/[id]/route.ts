import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { revalidatePath } from 'next/cache';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Ambil semua data yang dikirim dari frontend
    const body = await request.json();

    // Mencegah menu menjadikan dirinya sendiri sebagai parent
    if (body.parentId && id === body.parentId) {
      return NextResponse.json({ message: 'Menu tidak bisa menjadi sub-menu dari dirinya sendiri' }, { status: 400 });
    }

    // Hanya update kolom yang dikirimkan (Update Parsial)
    const dataToUpdate: any = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.order !== undefined) dataToUpdate.order = Number(body.order);
    if (body.parentId !== undefined) dataToUpdate.parentId = body.parentId || null;
    if (body.linkType !== undefined) dataToUpdate.linkType = body.linkType;
    if (body.linkTarget !== undefined) dataToUpdate.linkTarget = body.linkTarget;
    if (body.url !== undefined) dataToUpdate.url = body.url;

    const updatedMenu = await prisma.webMenu.update({
      where: { id },
      data: dataToUpdate
    });

    revalidatePath('/', 'layout'); // Sinkronisasi Frontend Instan
    return NextResponse.json({ message: 'Data menu diperbarui', menu: updatedMenu });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui menu' }, { status: 500 });
  }
}

// ... (KODE DELETE DI BAWAHNYA TETAP SAMA SEPERTI SEBELUMNYA)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const subMenuCount = await prisma.webMenu.count({ where: { parentId: id } });
    if (subMenuCount > 0) {
      return NextResponse.json({ message: 'Hapus sub-menu di bawahnya terlebih dahulu!' }, { status: 400 });
    }

    await prisma.webMenu.delete({ where: { id } });

    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Menu dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus menu' }, { status: 500 });
  }
}