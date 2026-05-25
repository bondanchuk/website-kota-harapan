import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function GET() {
  try {
    // Ambil berita dan sertakan data nama kategorinya
    const posts = await prisma.blogPost.findMany({ 
      include: { category: true },
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET BLOG Error:", error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const content = formData.get('content') as string;
    const contentEn = formData.get('contentEn') as string;
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    if (!title || !categoryId) return NextResponse.json({ message: 'Judul dan Kategori wajib diisi' }, { status: 400 });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ message: 'Judul berita ini sudah ada!' }, { status: 400 });

    let imagePath = null;
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      await fs.writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    const newPost = await prisma.blogPost.create({
      data: { title, slug, categoryId, content, contentEn, status, image: imagePath }
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Berita berhasil diterbitkan', post: newPost });
  } catch (error) {
    console.error("POST BLOG Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}