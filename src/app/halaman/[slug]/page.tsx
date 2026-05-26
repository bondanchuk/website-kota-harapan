import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { notFound } from 'next/navigation';

// Inisialisasi Database
const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export default async function HalamanPublikDinamis({ params }: { params: Promise<{ slug: string }> }) {
  // Tunggu parameter URL terbaca (Next.js 15+ standard)
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Cari data halaman di PostgreSQL berdasarkan slug URL
  const pageData = await prisma.webPage.findUnique({
    where: { slug }
  });

  // Jika halaman tidak ada atau berstatus DRAFT, lemparkan ke halaman 404 bawaan
  if (!pageData || pageData.status !== 'publish') {
    notFound();
  }

  // Jika ada, render tampilannya
  return (
    <main className="pt-32 pb-20 px-6 max-w-[1000px] mx-auto min-h-screen">
      <div className="bg-white p-8 md:p-14 rounded-2xl shadow-sm border border-slate-100">
        
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-8 tracking-tight leading-tight">
          {pageData.title}
        </h1>
        
        {pageData.image && (
          <div className="w-full h-[300px] md:h-[500px] mb-12 rounded-xl overflow-hidden shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={pageData.image} 
              alt={pageData.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* dangerouslySetInnerHTML digunakan agar tag HTML dari WYSIWYG Editor 
          (<p>, <strong>, <img>) bisa dirender menjadi tampilan yang sebenarnya 
        */}
        <div 
          className="prose prose-lg max-w-none text-slate-700 prose-headings:text-slate-800 prose-a:text-amber-600 hover:prose-a:text-red-800" 
          dangerouslySetInnerHTML={{ __html: pageData.content || '' }} 
        />
        
      </div>
    </main>
  );
}