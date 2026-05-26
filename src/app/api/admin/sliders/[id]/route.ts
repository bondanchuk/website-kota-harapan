import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import path from 'path';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp'; // <-- IMPOR PUSTAKA KOMPRESI

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const order = Number(formData.get('order')) || 0;
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    let updateData: any = { title, subtitle, link, order, status };

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `slider_${Date.now()}.webp`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);

      // ----------------------------------------------------
      // PROSES KOMPRESI GAMBAR SAAT UPDATE
      // ----------------------------------------------------
      await sharp(buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);

      updateData.image = `/uploads/${filename}`;
    }

    const updatedSlider = await prisma.slider.update({ where: { id: resolvedParams.id }, data: updateData });
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Slider diperbarui', slider: updatedSlider });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui slider' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.slider.delete({ where: { id: resolvedParams.id } });
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Slider dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus slider' }, { status: 500 });
  }
}