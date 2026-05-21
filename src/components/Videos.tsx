import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function Videos() {
  const thumbnails = [
    { title: "Dokumentasi Pertemuan Kerja Pemutakhiran Data Wilayah" },
    { title: "Panduan Teknis Operasional Pengolahan Aplikasi Digital" },
    { title: "Sosialisasi Evaluasi Standar Pelayanan Publik Terpadu" },
    { title: "Kilasan Kegiatan Penyelarasan Agenda Kerja Strategis" },
    { title: "Sistem Manajemen Basis Data dan Integrasi Cloud Keamanan" },
  ];

  return (
    <section className="bg-cover bg-center pt-24 pb-20 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549221191-49666c8d76a7?auto=format&fit=crop&w=1920&q=80')" }}>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="max-w-[1600px] mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* VIDEO BESAR UTAMA (Diperbaiki Proporsinya menjadi aspect-video / 16:9) */}
        <div className="w-full max-w-6xl aspect-video bg-black/40 border border-white/10 p-6 md:p-12 text-white text-center flex flex-col items-center justify-center shadow-2xl mb-16 rounded-sm relative overflow-hidden group cursor-pointer">
          
          {/* Efek Thumbnail Latar Belakang Video */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>

          <div className="relative z-10 flex flex-col items-center mt-8">
            <h2 className="text-xs md:text-sm font-bold tracking-widest text-[var(--accent-gold)] uppercase mb-6 drop-shadow-md">GALERI VIDEO RESMI</h2>
            <PlayCircle size={92} className="text-white/90 group-hover:text-[var(--accent-gold)] transition-colors mb-8 transform group-hover:scale-110 duration-300 drop-shadow-xl" />
            <h3 className="text-2xl md:text-5xl font-black tracking-tight max-w-4xl leading-tight uppercase drop-shadow-lg">
              Transparansi Kerja, Akurasi Data, & Pelayanan Prima
            </h3>
          </div>
        </div>

        {/* Baris Bawah: 5 Video List */}
        <div className="relative w-full px-8 mb-12">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[var(--primary-color)] text-white p-2 rounded-full border border-white/15">
            <ChevronLeft size={20} />
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
            {thumbnails.map((thumb, index) => (
              <div key={index} className="bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col space-y-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group rounded-sm">
                <div className="relative aspect-video bg-black/40 overflow-hidden flex items-center justify-center rounded-xs">
                  <PlayCircle size={28} className="text-white/60 group-hover:text-[var(--accent-gold)] transition-colors z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors leading-snug line-clamp-2">{thumb.title}</h4>
              </div>
            ))}
          </div>

          <button className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[var(--primary-color)] text-white p-2 rounded-full border border-white/15">
            <ChevronRight size={20} />
          </button>
        </div>

        <button className="px-6 py-3 border border-white/30 text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-slate-900 transition-all duration-300 rounded-sm">
          More Videos
        </button>
      </div>
    </section>
  );
}