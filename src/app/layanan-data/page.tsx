import { Database, FileText, ChevronRight } from "lucide-react";

export default function LayananData() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20"> 
      {/* HEADER HALAMAN (Banner Kecil) */}
      <div className="bg-[var(--primary-color)] py-16 text-white border-b-4 border-[var(--accent-gold)] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase mb-4 shadow-sm">
            Layanan Data Publik
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl leading-relaxed">
            Pusat informasi dan pengelolaan basis data terpadu untuk kebutuhan tata kelola wilayah, pemetaan fasilitas, dan administrasi kependudukan yang akurat.
          </p>
        </div>
      </div>

      {/* KONTEN UTAMA HALAMAN */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri (Modul Aplikasi Terpadu) */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
          
          <div className="bg-white p-8 shadow-sm border border-slate-200 rounded-sm">
            <div className="flex items-center space-x-3 mb-6 border-b-2 border-slate-100 pb-3">
              <Database className="text-[var(--primary-color)]" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                Sistem Optimasi & Pemetaan TPS
              </h2>
            </div>
            
            <div className="bg-slate-50 p-6 border border-slate-200 rounded-sm mb-6 border-l-4 border-l-[var(--primary-color)]">
              <h3 className="font-bold text-slate-700 mb-2 text-sm">Parameter Pemetaan Berjalan</h3>
              <p className="text-xs md:text-sm text-slate-600 mb-4 leading-relaxed">
                Modul saat ini dikonfigurasi untuk melakukan optimasi distribusi pemilih per TPS dengan memfilter basis data berdasarkan kriteria status pemilih berikut:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white border border-slate-200 text-[10px] md:text-xs font-bold text-[var(--primary-color)] rounded-full uppercase tracking-wider shadow-sm">Rank: Aktif</span>
                <span className="px-3 py-1 bg-white border border-slate-200 text-[10px] md:text-xs font-bold text-[var(--primary-color)] rounded-full uppercase tracking-wider shadow-sm">Rank: Baru</span>
                <span className="px-3 py-1 bg-white border border-slate-200 text-[10px] md:text-xs font-bold text-[var(--primary-color)] rounded-full uppercase tracking-wider shadow-sm">Rank: Ubah</span>
              </div>
            </div>
            
            <button className="px-6 py-3 bg-[var(--primary-color)] text-white font-bold text-xs tracking-widest uppercase hover:bg-[var(--primary-dark)] transition-colors duration-300 rounded-sm shadow-sm flex items-center">
              Buka Modul Pemetaan <ChevronRight size={16} className="ml-2" />
            </button>
          </div>

        </div>

        {/* Kolom Kanan (Sidebar Informasi) */}
        <div className="flex flex-col">
          <div className="bg-white p-6 shadow-sm border border-slate-200 rounded-sm">
            <div className="flex items-center space-x-3 mb-6 border-b-2 border-slate-100 pb-3">
              <FileText className="text-[var(--accent-gold)]" size={20} />
              <h2 className="text-lg font-bold text-slate-800">
                Dokumen & Referensi
              </h2>
            </div>
            <ul className="space-y-4 text-xs md:text-sm text-slate-600 font-medium">
               <li className="flex items-start space-x-2 group cursor-pointer">
                  <span className="text-slate-300 group-hover:text-[var(--accent-gold)] transition-colors">➔</span>
                  <a href="#" className="group-hover:text-[var(--primary-color)] transition-colors leading-snug">SOP Pemutakhiran Data Wilayah Kepulauan</a>
               </li>
               <li className="flex items-start space-x-2 group cursor-pointer">
                  <span className="text-slate-300 group-hover:text-[var(--accent-gold)] transition-colors">➔</span>
                  <a href="#" className="group-hover:text-[var(--primary-color)] transition-colors leading-snug">Distribusi Rekapitulasi Tingkat Kabupaten</a>
               </li>
               <li className="flex items-start space-x-2 group cursor-pointer">
                  <span className="text-slate-300 group-hover:text-[var(--accent-gold)] transition-colors">➔</span>
                  <a href="#" className="group-hover:text-[var(--primary-color)] transition-colors leading-snug">Panduan Teknis Operasional GUI</a>
               </li>
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}