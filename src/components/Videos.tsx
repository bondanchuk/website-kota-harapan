import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function Videos() {
  const thumbnails = [
    { title: "Dokumentasi Pertemuan Kerja Pemutakhiran Data Wilayah" },
    { title: "Panduan Teknis Operasional Pengolahan Aplikasi Digital" },
    { title: "Sosialisasi Evaluasi Standar Pelayanan Publik Terpadu" },
    { title: "Kilasan Kegiatan Penyelarasan Agenda Kerja Strategis" },
  ];

  return (
    <section 
      className="bg-cover bg-center pt-24 pb-20 relative" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549221191-49666c8d76a7?auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Kontainer Video Utama */}
        <div className="w-full max-w-4xl bg-black/30 border border-white/10 p-12 text-white text-center flex flex-col items-center justify-center shadow-2xl mb-16 rounded-sm">
          <h2 className="text-xs font-bold tracking-widest text-[var(--accent-gold)] uppercase mb-4">GALERI VIDEO RESMI</h2>
          <PlayCircle size={72} className="text-white hover:text-[var(--accent-gold)] transition-colors cursor-pointer mb-6 transform hover:scale-105 duration-300" />
          <h3 className="text-3xl md:text-4xl font-black tracking-tight max-w-2xl leading-tight uppercase">
            Transparansi Kerja, Akurasi Data, & Pelayanan Prima
          </h3>
        </div>

        {/* Kontainer Baris Thumbnail dengan Navigasi Carousel */}
        <div className="relative w-full px-8 mb-12">
          {/* Panah Kiri */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[var(--primary-color)] text-white p-2 rounded-full transition-colors border border-white/15">
            <ChevronLeft size={24} />
          </button>

          {/* Grid Thumbnail Video */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {thumbnails.map((thumb, index) => (
              <div 
                key={index} 
                className="bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col space-y-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="relative aspect-video bg-black/40 overflow-hidden flex items-center justify-center">
                  <PlayCircle size={32} className="text-white/60 group-hover:text-[var(--accent-gold)] transition-colors z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
                  {thumb.title}
                </h4>
              </div>
            ))}
          </div>

          {/* Panah Kanan */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[var(--primary-color)] text-white p-2 rounded-full transition-colors border border-white/15">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Tombol More Videos */}
        <div className="w-full flex justify-center">
          <button className="px-6 py-3 border border-white/30 text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-slate-900 transition-all duration-300 rounded-sm">
            More Videos
          </button>
        </div>

      </div>
    </section>
  );
}