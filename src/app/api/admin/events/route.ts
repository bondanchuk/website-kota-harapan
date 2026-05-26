export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import path from 'path';
import sharp from 'sharp';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function GET() {
  try {
    const agendas = await prisma.agenda.findMany({ orderBy: { eventDate: 'desc' } });
    return NextResponse.json(agendas);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching agendas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const eventDate = new Date(formData.get('eventDate') as string);
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    if (!title || !eventDate) {
      return NextResponse.json({ message: 'Judul dan Tanggal wajib diisi' }, { status: 400 });
    }

    // Buat URL slug otomatis
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    let imagePath = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `agenda_${Date.now()}.webp`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);

      await sharp(buffer)
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);

      imagePath = `/uploads/${filename}`;
    }

    const newAgenda = await prisma.agenda.create({
      data: { title, slug, description, location, eventDate, status, image: imagePath }
    });

    return NextResponse.json({ message: 'Agenda berhasil ditambahkan', agenda: newAgenda });
  } catch (error) {
    console.error("POST Agenda Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}