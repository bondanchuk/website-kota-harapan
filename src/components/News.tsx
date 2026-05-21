import { Clock, TrendingUp, Eye, Calendar } from "lucide-react";

export default function News() {
  // Ditambah menjadi 4 item untuk susunan 4 kolom
  const beritaTerbaru = [
    { id: 1, title: "Penerapan Modul Aplikasi Pemetaan Wilayah untuk Layanan Terpadu", date: "21 Mei 2026", views: "1.240", image: "https://images.unsplash.com/photo-1549221191-49666c8d76a7?auto=format&fit=crop&w=600&q=80", excerpt: "Sistem pemetaan digital guna mempercepat birokrasi dan akurasi distribusi layanan publik..." },
    { id: 2, title: "Rapat Koordinasi Penyusunan SOP Pemutakhiran Data Pemilih Wilayah Kepulauan", date: "20 Mei 2026", views: "980", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", excerpt: "Langkah penataan regulasi data terpadu demi memastikan validitas informasi di kawasan pesisir..." },
    { id: 3, title: "Langkah Efisiensi Pengelolaan Basis Data Terpadu Tingkat Daerah", date: "19 Mei 2026", views: "850", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", excerpt: "Optimalisasi server lokal dan pembersihan data ganda antarwilayah sukses memangkas waktu..." },
    { id: 4, title: "Penyelarasan Regulasi Terbaru dan Penguatan Keamanan Infrastruktur Jaringan", date: "18 Mei 2026", views: "710", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80", excerpt: "Implementasi sistem proteksi siber terpusat untuk menjaga kedaulatan data administrasi..." }
  ];

  // Ditambah menjadi 5 item untuk susunan 5 kolom
  const beritaTerpopuler = [
    { id: 1, title: "Apresiasi Kinerja Sektor Pelayanan Publik Terpadu", date: "10 Mei 2026", views: "14.500", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Sosialisasi Alur Pengajuan Layanan Administrasi Mandiri", date: "12 Mei 2026", views: "12.310", image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Panduan Teknis Sistem Optimasi Pemilih per TPS Lapangan", date: "15 Mei 2026", views: "9.820", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Rencana Pembukaan Kawasan Hijau dan Taman Olahraga Baru", date: "08 Mei 2026", views: "8.450", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Evaluasi Berkala Kesiapan Sarana Prasarana Digital Kota", date: "05 Mei 2026", views: "7.910", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <section className="bg-slate-50 py-16 border-t border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col space-y-20">
        
        {/* BERITA TERBARU (4 KOLOM) */}
        <div>
          <div className="flex items-center space-x-3 mb-8 border-b border-slate-200 pb-3">
            <Clock className="text-[var(--primary-color)]" size={24} />
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Berita Terbaru</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {beritaTerbaru.map((news) => (
              <div key={news.id} className="bg-white border border-slate-200 shadow-xs rounded-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="overflow-hidden aspect-video"><img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/></div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-semibold mb-2">
                      <span className="flex items-center"><Calendar size={10} className="mr-1"/> {news.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors line-clamp-2">{news.title}</h3>
                  </div>
                  <span className="text-[var(--accent-gold)] text-sm font-bold mt-4 self-end">➔</span>
                </div>
              </div>
            ))}
          </div>
          <button className="px-5 py-2.5 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-[10px] tracking-widest uppercase hover:bg-[var(--primary-color)] hover:text-white transition-colors duration-300 rounded-sm">More Latest News</button>
        </div>

        {/* BERITA TERPOPULER (5 KOLOM) */}
        <div>
          <div className="flex items-center space-x-3 mb-8 border-b border-slate-200 pb-3">
            <TrendingUp className="text-[var(--primary-color)]" size={24} />
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Berita Terpopuler</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-8">
            {beritaTerpopuler.map((news) => (
              <div key={news.id} className="bg-white border border-slate-200 shadow-xs rounded-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="overflow-hidden aspect-video relative">
                  <img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center space-x-1"><Eye size={9} className="text-[var(--accent-gold)]" /><span>{news.views}</span></div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-700 leading-snug group-hover:text-[var(--primary-color)] transition-colors line-clamp-3">{news.title}</h3>
                  <span className="text-[9px] text-gray-400 mt-2">{news.date}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="px-5 py-2.5 bg-[var(--primary-color)] text-white font-bold text-[10px] tracking-widest uppercase hover:bg-[var(--primary-dark)] transition-colors duration-300 rounded-sm">More Popular News</button>
        </div>

      </div>
    </section>
  );
}