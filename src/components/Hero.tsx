'use client';
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, ShieldAlert, Phone, Flame } from "lucide-react"; 

export default function Hero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // FUNGSI FETCH: Hanya untuk slider
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch('/api/sliders-public');
        const data = await res.json();
        if (Array.isArray(data)) setSlides(data);
      } catch (error) {
        console.error("Gagal memuat slider:", error);
      }
    };
    fetchSliders();
  }, []);

  // Slider Otomatis
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const cards = [
    { title: "Layanan Kependudukan", color: "var(--card-1)", icon: "🏛️" },
    { title: "Pusat Informasi Data", color: "var(--card-2)", icon: "📊" },
    { title: "Portal Rekreasi & Taman", color: "var(--card-3)", icon: "🌳" },
    { title: "Agenda Pertemuan", color: "var(--card-4)", icon: "📅" },
    { title: "Perizinan Terpadu", color: "var(--card-1)", icon: "📄" },
    { title: "Informasi Tata Ruang", color: "var(--card-2)", icon: "🗺️" },
    { title: "Pengaduan Warga", color: "var(--card-3)", icon: "📣" },
    { title: "Layanan Kesehatan", color: "var(--card-4)", icon: "🏥" },
    { title: "Data Statistik Wilayah", color: "var(--card-1)", icon: "📈" },
  ];

  return (
    <section className="relative w-full bg-[#f8fafc] overflow-hidden">
      
      {/* BACKGROUND BANNER SLIDER */}
      <div className="relative w-full h-[600px] overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out flex items-center ${
              index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        <button onClick={prevSlide} className="hidden md:block absolute left-6 top-[35%] -translate-y-1/2 z-20 bg-black/30 hover:bg-[var(--primary-color)] text-white p-3 rounded-full transition-colors border border-white/20 backdrop-blur-sm">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="hidden md:block absolute right-6 top-[35%] -translate-y-1/2 z-20 bg-black/30 hover:bg-[var(--primary-color)] text-white p-3 rounded-full transition-colors border border-white/20 backdrop-blur-sm">
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-[var(--accent-gold)] w-10 shadow-md" : "bg-white/50 w-3"}`}
            />
          ))}
        </div>
      </div>

      {/* AREA KONTEN OVERLAP */}
      <div className="max-w-[1600px] mx-auto px-6 -mt-24 relative z-30 w-full pb-16">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ==========================================
              SISI KIRI: Search Bar + 9 Kartu Layanan 
              ========================================== */}
          <div className="lg:col-span-7 flex flex-col w-full h-full">
            
            {/* Search Bar (Ketinggian tetap 54px + Margin 24px = 78px) */}
            <div className="w-full max-w-lg mb-6 flex-none">
              <div className="flex items-center bg-white p-1 rounded-sm shadow-xl border border-slate-100 h-[54px]">
                <Search className="text-gray-400 ml-4" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari layanan, berita, atau informasi..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-slate-800 font-medium placeholder-gray-400 h-full"
                />
                <button className="bg-[var(--primary-color)] text-white px-6 py-0 h-full text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--accent-gold)] hover:text-slate-900 transition-colors">
                  Cari
                </button>
              </div>
            </div>

            {/* Grid 3x3 Kartu Layanan */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
              {cards.map((card, index) => (
                <div 
                  key={index} 
                  className="bg-white p-5 md:p-7 shadow-xl border-t-[5px] hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer flex flex-col items-center text-center justify-center group rounded-sm min-h-[145px]" 
                  style={{ borderTopColor: card.color }}
                >
                  <div className="text-3xl mb-3 text-[var(--primary-color)] group-hover:scale-110 transition-transform">{card.icon}</div> 
                  <h3 className="text-xs md:text-sm font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* ==========================================
              SISI KANAN: Kotak Hero & Kotak Darurat 
              ========================================== */}
          {/* PERBAIKAN UTAMA: lg:pt-[78px] digunakan agar seluruh isi kotak kanan 
              didorong ke bawah sejauh tinggi Search Bar di sisi kiri. */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full lg:pt-[78px]">
            
            {/* 1. KOTAK HERO (Batas Atas sekarang sejajar dengan Kartu Layanan) */}
            <div className="relative w-full flex-none h-[220px] lg:h-[220px] bg-[var(--primary-color)] shadow-xl border-t-[5px] border-[var(--accent-gold)] overflow-hidden rounded-sm">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-start transition-all duration-700 ease-in-out ${
                    index === currentSlide ? "opacity-100 translate-x-0 z-10 pointer-events-auto" : "opacity-0 translate-x-8 z-0 pointer-events-none"
                  }`}
                >
                  <span className="text-[10px] md:text-xs font-bold tracking-widest text-[var(--accent-gold)] uppercase block mb-2">
                    INFORMASI PUBLIK
                  </span>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-2 leading-tight tracking-tight text-white line-clamp-2">
                    {slide.title}
                  </h2>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-200 line-clamp-2">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* 2. KOTAK PANGGILAN DARURAT (Otomatis mengisi sisa celah di bawah) */}
            <div className="w-full flex-1 bg-gradient-to-br from-red-950 to-red-900 shadow-xl border-t-[5px] border-amber-500 rounded-sm p-6 flex flex-col justify-center text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                <ShieldAlert size={120} />
              </div>
              
              <div className="relative z-10 flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-3">
                  <ShieldAlert className="text-amber-500 animate-pulse" size={20} />
                  <h4 className="text-sm font-black tracking-widest uppercase text-amber-500">Panggilan Darurat</h4>
                </div>
                
                <div className="flex flex-col gap-3 text-xs md:text-sm">
                  <div className="flex items-center justify-between bg-black/20 p-3.5 rounded-sm border border-white/5 hover:bg-black/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-emerald-400" />
                      <span className="font-bold text-gray-200">Gawat Darurat 112</span>
                    </div>
                    <span className="font-black text-sm text-emerald-400 tracking-wider">112</span>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-3.5 rounded-sm border border-white/5 hover:bg-black/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <Flame size={16} className="text-orange-400" />
                      <span className="font-bold text-gray-200">Pemadam Kebakaran</span>
                    </div>
                    <span className="font-black text-sm text-orange-400 tracking-wider">113</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}