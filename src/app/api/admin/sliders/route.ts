import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import path from 'path';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp'; // <-- IMPOR PUSTAKA KOMPRESI

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching sliders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const order = Number(formData.get('order')) || 0;
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    if (!title || !file || file.size === 0) {
      return NextResponse.json({ message: 'Judul dan Gambar wajib diisi' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Ubah nama file otomatis menggunakan ekstensi .webp untuk ukuran terkecil
    const filename = `slider_${Date.now()}.webp`; 
    const filepath = path.join(process.cwd(), 'public/uploads', filename);

    // ----------------------------------------------------
    // PROSES KOMPRESI GAMBAR DENGAN SHARP
    // ----------------------------------------------------
    await sharp(buffer)
      .resize(1920, 1080, { 
        fit: 'inside', // Menjaga proporsi gambar
        withoutEnlargement: true // Jangan perbesar gambar yang ukurannya kecil
      })
      .webp({ quality: 80 }) // Kompres gambar ke format WebP dengan kualitas 80%
      .toFile(filepath);

    const imagePath = `/uploads/${filename}`;

    const newSlider = await prisma.slider.create({
      data: { title, subtitle, link, order, status, image: imagePath }
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Slider berhasil ditambahkan', slider: newSlider });
  } catch (error) {
    console.error("POST SLIDER Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}