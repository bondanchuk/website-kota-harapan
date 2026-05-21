import { Clock, TrendingUp, Eye, Calendar } from "lucide-react";

export default function BeritaPage() {
  // Data Mockup Berita Terbaru
  const beritaTerbaru = [
    {
      id: 1,
      title: "Penerapan Modul Aplikasi Pemetaan Wilayah untuk Layanan Terpadu yang Responsif",
      date: "21 Mei 2026",
      views: "1.240",
      image: "https://images.unsplash.com/photo-1549221191-49666c8d76a7?auto=format&fit=crop&w=600&q=80",
      excerpt: "Pemerintah wilayah mulai menguji coba sistem pemetaan digital guna mempercepat birokrasi dan akurasi distribusi layanan publik..."
    },
    {
      id: 2,
      title: "Rapat Koordinasi Penyusunan SOP Pemutakhiran Data Pemilih Wilayah Kepulauan",
      date: "20 Mei 2026",
      views: "980",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      excerpt: "Langkah strategis penataan regulasi data terpadu demi memastikan validitas informasi di kawasan pesisir pulau terluar..."
    },
    {
      id: 3,
      title: "Langkah Efisiensi Pengelolaan Basis Data Terpadu Tingkat Daerah",
      date: "19 Mei 2026",
      views: "850",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      excerpt: "Optimalisasi server lokal dan pembersihan data ganda antarwilayah sukses memangkas waktu pemrosesan administrasi..."
    }
  ];

  // Data Mockup Berita Terpopuler
  const beritaTerpopuler = [
    {
      id: 1,
      title: "Apresiasi Kinerja Sektor Pelayanan Publik dan Optimalisasi Aplikasi Digital",
      date: "10 Mei 2026",
      views: "14.500",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Penyelarasan Regulasi Terbaru dan Penguatan Keamanan Infrastruktur Jaringan",
      date: "12 Mei 2026",
      views: "12.310",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Panduan Teknis Sistem Optimasi Pemilih per TPS untuk Petugas Lapangan",
      date: "15 Mei 2026",
      views: "9.820",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Sosialisasi Jadwal dan Alur Pengajuan Layanan Administrasi Kependudukan",
      date: "08 Mei 2026",
      views: "8.450",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      
      {/* BANNER UTAMA HALAMAN BERITA */}
      <div className="bg-[var(--primary-color)] py-16 text-white border-b-4 border-[var(--accent-gold)] relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase mb-3">
            Pusat Berita & Informasi
          </h1>
          <p className="text-xs md:text-sm text-gray-200 max-w-xl leading-relaxed">
            Ikuti perkembangan kebijakan, agenda kerja strategis, pengumuman resmi, serta rekapitulasi data publik terkini seputar wilayah kota.
          </p>
        </div>
      </div>

      {/* SEGMEN 1: BERITA TERBARU (Latar Belakang Putih Kontras) */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center space-x-3 mb-10 border-b border-slate-100 pb-4">
            <Clock className="text-[var(--primary-color)] animate-pulse" size={24} />
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Berita Terbaru
            </h2>
          </div>

          {/* Grid Layout 3 Kolom Responsif */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {beritaTerbaru.map((news) => (
              <div 
                key={news.id} 
                className="bg-white border border-slate-100 shadow-sm rounded-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="overflow-hidden bg-slate-100 aspect-video relative">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-4 text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-3">
                      <span className="flex items-center"><Calendar size={12} className="mr-1"/> {news.date}</span>
                      <span className="flex items-center"><Eye size={12} className="mr-1"/> {news.views} Views</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 leading-snug mb-3 group-hover:text-[var(--primary-color)] transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>
                  </div>
                  <span className="text-[var(--accent-gold)] text-lg font-bold mt-4 self-end transition-transform group-hover:translate-x-1">➔</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol More News - Segmen Terbaru */}
          <div className="flex justify-start">
            <button className="px-5 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-[10px] tracking-widest uppercase hover:bg-[var(--primary-color)] hover:text-white transition-colors duration-300 rounded-sm shadow-sm">
              More Latest News
            </button>
          </div>
        </div>
      </section>

      {/* SEGMEN 2: BERITA TERPOPULER (Latar Belakang Abu-Abu Lembut) */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center space-x-3 mb-10 border-b border-slate-200 pb-4">
            <TrendingUp className="text-[var(--primary-color)]" size={24} />
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Berita Terpopuler
            </h2>
          </div>

          {/* Grid Layout 4 Kolom untuk Item Populer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {beritaTerpopuler.map((news) => (
              <div 
                key={news.id} 
                className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="overflow-hidden bg-slate-100 aspect-video relative">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge Jumlah Views Melayang */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-sm flex items-center space-x-1 backdrop-blur-xs">
                    <Eye size={10} className="text-[var(--accent-gold)]" />
                    <span>{news.views}</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs md:text-sm font-bold text-slate-700 leading-snug group-hover:text-[var(--primary-color)] transition-colors line-clamp-3">
                    {news.title}
                  </h3>
                  <span className="text-[10px] font-medium text-gray-400 mt-3">{news.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol More News - Segmen Terpopuler */}
          <div className="flex justify-start">
            <button className="px-5 py-3 bg-[var(--primary-color)] text-white font-bold text-[10px] tracking-widest uppercase hover:bg-[var(--primary-dark)] transition-colors duration-300 rounded-sm shadow-sm">
              More Popular News
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}