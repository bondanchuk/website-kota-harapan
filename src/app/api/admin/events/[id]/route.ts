import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import path from 'path';
import sharp from 'sharp';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const eventDate = new Date(formData.get('eventDate') as string);
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    let updateData: any = { title, description, location, eventDate, status };

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `agenda_${Date.now()}.webp`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);

      await sharp(buffer)
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);

      updateData.image = `/uploads/${filename}`;
    }

    const updatedAgenda = await prisma.agenda.update({ where: { id: resolvedParams.id }, data: updateData });
    return NextResponse.json({ message: 'Agenda diperbarui', agenda: updatedAgenda });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui agenda' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.agenda.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ message: 'Agenda dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus agenda' }, { status: 500 });
  }
}