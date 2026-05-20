export default function News() {
  const stories = [
    "Langkah Efisiensi Pengelolaan Basis Data Terpadu Tingkat Daerah",
    "Rapat Koordinasi Penyusunan SOP Pemutakhiran Data Pemilih Wilayah Kepulauan",
    "Apresiasi Kinerja Sektor Pelayanan Publik dan Optimalisasi Aplikasi Digital",
    "Penyelarasan Regulasi Terbaru dan Penguatan Keamanan Infrastruktur Jaringan",
  ];

  return (
    <section className="bg-slate-50 py-24 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black text-slate-800 mb-12 tracking-tight uppercase border-b-2 border-slate-200 pb-2 inline-block">
          BERITA & INFORMASI
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Berita Utama Banner Besar (Kiri) */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 shadow-sm flex flex-col space-y-5 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="overflow-hidden bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1549221191-49666c8d76a7?auto=format&fit=crop&w=600&q=80" 
                  alt="Berita Utama" 
                  className="w-full h-[270px] object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors">
                Penerapan Modul Aplikasi Pemetaan Wilayah untuk Layanan Terpadu yang Responsif
              </h3>
              <span className="text-[var(--accent-gold)] text-xl font-bold self-end transition-transform group-hover:translate-x-1">➔</span>
          </div>

          {/* Kolom Kanan: 4 Baris Berita + Tombol di Bawahnya */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Loop 4 baris berita */}
            {stories.map((story, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-100 p-5 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <h3 className="text-base font-bold text-slate-700 group-hover:text-[var(--primary-color)] transition-colors pr-4 leading-snug">
                  {story}
                </h3>
                <span className="text-slate-300 font-bold text-lg group-hover:text-[var(--accent-gold)] transition-colors">➔</span>
              </div>
            ))}

            {/* Tombol More News & Stories (Sekarang berada di bawah list sebelah kanan) */}
            <div className="pt-2 flex justify-start">
              <button className="px-6 py-3 bg-[var(--primary-color)] text-white font-bold text-xs tracking-widest uppercase hover:bg-[var(--primary-dark)] transition-colors duration-300 shadow-sm rounded-sm">
                More News & Stories
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}