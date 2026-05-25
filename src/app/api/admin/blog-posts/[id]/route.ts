import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const content = formData.get('content') as string;
    const contentEn = formData.get('contentEn') as string;
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    let updateData: any = { title, categoryId, content, contentEn, status };

    if (title) {
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      await fs.writeFile(filepath, buffer);
      updateData.image = `/uploads/${filename}`;
    }

    const updatedPost = await prisma.blogPost.update({ where: { id }, data: updateData });
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Berita diperbarui', post: updatedPost });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui berita' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.blogPost.delete({ where: { id: resolvedParams.id } });
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Berita dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus berita' }, { status: 500 });
  }
}