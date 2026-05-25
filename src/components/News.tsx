'use client';
import { useState, useEffect } from "react";
import { Clock, TrendingUp, Eye, Calendar } from "lucide-react";

export default function News() {
  const [beritaTerbaru, setBeritaTerbaru] = useState<any[]>([]);
  const [beritaTerpopuler, setBeritaTerpopuler] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data berita dari API Publik
  useEffect(() => {
    const fetchPublicNews = async () => {
      try {
        const res = await fetch('/api/news-public');
        const data = await res.json();
        
        if (res.ok) {
          setBeritaTerbaru(Array.isArray(data.terbaru) ? data.terbaru : []);
          setBeritaTerpopuler(Array.isArray(data.terpopuler) ? data.terpopuler : []);
        }
      } catch (error) {
        console.error("Gagal memuat data berita di frontend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicNews();
  }, []);

  // Fungsi pembantu untuk membersihkan tag HTML WYSIWYG dari tulisan kutipan (excerpt)
  // Fungsi pembantu untuk membersihkan tag HTML dan Entitas Karakter dari tulisan kutipan (excerpt)
  const stripHtml = (htmlString: string) => {
    if (!htmlString) return "";
    
    // 1. Hapus semua tag HTML (seperti <p>, <img>, <br>)
    let text = htmlString.replace(/<[^>]*>?/gm, '');
    
    // 2. Ganti entitas HTML umum kembali menjadi karakter aslinya
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    
    return text;
  };

  if (isLoading) {
    return (
      <section className="max-w-[1600px] mx-auto px-6 py-12 text-center text-sm font-semibold text-slate-500">
        Memuat data berita terkini...
      </section>
    );
  }

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-12">
      {/* ========================================================
          BAGIAN 1: BERITA TERBARU (KATEGORI: BERITA TERKINI)
         ======================================================== */}
      <div className="flex items-center space-x-2.5 mb-6 border-b border-gray-100 pb-3">
        <Clock className="text-[var(--primary-color)]" size={22} />
        <h2 className="text-lg font-black tracking-wider uppercase text-slate-800">Berita Terkini</h2>
      </div>

      {beritaTerbaru.length === 0 ? (
        <p className="text-sm text-slate-400 italic mb-12">Belum ada berita terbit dalam kategori Berita Terkini.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {beritaTerbaru.map((news) => (
            <div key={news.id} className="bg-white border border-slate-100 shadow-xs rounded-sm overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="overflow-hidden aspect-video relative bg-slate-100">
                {news.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">No Image</div>
                )}
                <div className="absolute top-2 left-2 bg-[var(--primary-color)] text-white text-[9px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                  {news.category?.name || 'Berita'}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors line-clamp-2 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
                    {stripHtml(news.content || "")}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium border-t border-slate-50 pt-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={12} />
                    <span>{news.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          BAGIAN 2: BERITA TERPOPULER (URUTAN VIEWS TERBANYAK)
         ======================================================== */}
      <div className="flex items-center space-x-2.5 mb-6 border-b border-gray-100 pb-3">
        <TrendingUp className="text-[var(--primary-color)]" size={22} />
        <h2 className="text-lg font-black tracking-wider uppercase text-slate-800">Berita Terpopuler</h2>
      </div>

      {beritaTerpopuler.length === 0 ? (
        <p className="text-sm text-slate-400 italic mb-8">Belum ada data tayangan berita.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-8">
          {beritaTerpopuler.map((news) => (
            <div key={news.id} className="bg-white border border-slate-200 shadow-xs rounded-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="overflow-hidden aspect-video relative bg-slate-100">
                {news.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold">No Image</div>
                )}
                <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center space-x-1">
                  <Eye size={9} className="text-[var(--accent-gold)]" />
                  <span>{news.views}</span>
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-slate-700 leading-snug group-hover:text-[var(--primary-color)] transition-colors line-clamp-3">
                  {news.title}
                </h3>
                <span className="text-[9px] text-gray-400 mt-2">
                  {new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <button className="px-5 py-2.5 bg-[var(--primary-color)] text-white text-xs font-bold tracking-widest uppercase rounded-sm shadow-xs hover:bg-red-800 transition-colors">
          Lihat Semua Berita
        </button>
      </div>
    </section>
  );
}