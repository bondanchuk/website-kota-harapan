import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { notFound } from 'next/navigation';
import { Calendar, Eye, FolderOpen } from 'lucide-react';

// Inisialisasi Database
const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Fungsi untuk membersihkan HTML untuk cuplikan teks
const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  let text = htmlString.replace(/<[^>]*>?/gm, '');
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return text;
};

export default async function KategoriBeritaDinamis({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Cari kategori berdasarkan slug URL, sekaligus tarik semua BERITA yang berstatus 'publish' di dalamnya
  const categoryData = await prisma.blogCategory.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: 'publish' },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  // Jika kategori tidak ditemukan, lemparkan ke halaman 404
  if (!categoryData) {
    notFound();
  }

  return (
    <main className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto min-h-screen">
      
      {/* HEADER KATEGORI */}
      <div className="mb-12 border-b border-slate-200 pb-6 flex items-center gap-4">
        <div className="p-4 bg-red-50 rounded-xl">
          <FolderOpen size={32} className="text-[var(--primary-color)]" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">
            {categoryData.name}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Menampilkan seluruh berita dan publikasi dalam kategori ini.
          </p>
        </div>
      </div>

      {/* GRID DAFTAR BERITA */}
      {categoryData.posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Belum ada berita yang diterbitkan pada kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.posts.map((news) => (
            <div key={news.id} className="bg-white border border-slate-100 shadow-xs rounded-xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              
              {/* Gambar Berita */}
              <div className="overflow-hidden aspect-video relative bg-slate-100">
                {news.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">Tidak ada gambar</div>
                )}
              </div>

              {/* Konten Berita */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors line-clamp-2 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
                    {stripHtml(news.content || "")}
                  </p>
                </div>

                {/* Footer Kartu Berita */}
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium border-t border-slate-50 pt-4">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={14} className="text-slate-300" />
                    <span>{new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Eye size={14} className="text-slate-300" />
                    <span>{news.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}