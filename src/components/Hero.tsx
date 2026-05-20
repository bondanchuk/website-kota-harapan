'use client';
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  // Data slide banner (gambar, judul, deskripsi, dan tagline kontekstual)
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1549221191-49666c8d76a7?auto=format&fit=crop&w=1920&q=80",
      tagline: "WHERE ART MEETS ADVENTURE",
      title: "Pusat Layanan Terpadu Kota Harapan",
      description: "Akses cepat informasi tata kota, layanan perizinan, pengelolaan data kependudukan, hingga destinasi wisata lokal dalam satu portal resmi."
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
      tagline: "PELAYANAN PRIMA & TRANSPARAN",
      title: "Komitmen Kemudahan Informasi Publik",
      description: "Menyediakan transparansi tata kelola data yang akurat dan akuntabel demi mendorong efisiensi pelayanan terpadu bagi seluruh elemen masyarakat."
    },
    {
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80",
      tagline: "JELAJAHI POTENSI WILAYAH",
      title: "Eksplorasi Ruang Publik & Komunitas",
      description: "Temukan agenda kegiatan kota, pemetaan fasilitas umum, kawasan hijau rekreasi, serta pusat pengembangan ekonomi kreatif lokal."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Efek autoplay untuk memindahkan slide otomatis setiap 6 detik
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const cards = [
    { title: "Layanan Kependudukan", color: "var(--card-1)" },
    { title: "Pusat Informasi Data", color: "var(--card-2)" },
    { title: "Portal Rekreasi & Taman", color: "var(--card-3)" },
    { title: "Agenda Pertemuan", color: "var(--card-4)" },
  ];

  return (
    <section className="relative w-full bg-[#f8fafc] overflow-hidden">
      
      {/* 1. KONTEN CAROUSEL BANNER */}
      <div className="relative w-full h-[600px] overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out flex items-center ${
              index === currentSlide 
                ? "opacity-100 scale-100 z-10" 
                : "opacity-0 scale-105 z-0"
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Overlay gelap tipis agar gambar menyatu dengan latar */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}

        {/* NAVIGASI PANAH BANNER (Disesuaikan posisi vertikalnya) */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-[35%] -translate-y-1/2 z-20 bg-black/30 hover:bg-[var(--primary-color)] text-white p-3 rounded-full transition-colors border border-white/20 backdrop-blur-sm"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-[35%] -translate-y-1/2 z-20 bg-black/30 hover:bg-[var(--primary-color)] text-white p-3 rounded-full transition-colors border border-white/20 backdrop-blur-sm"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* INDIKATOR TITIK / DOTS (Diturunkan posisinya mengikuti pergeseran kartu) */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-[var(--accent-gold)] w-10 shadow-md" 
                  : "bg-white/50 hover:bg-white w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. AREA OVERLAP (Diturunkan posisi vertikalnya sekitar 1cm menjadi -mt-14) */}
      <div className="max-w-7xl mx-auto px-6 -mt-14 relative z-30 w-full pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* SISI KIRI: 4 Kartu Layanan disusun menjadi grid 2x2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <div 
                key={index} 
                className="bg-white p-8 shadow-xl border-t-[6px] hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer flex flex-col items-center text-center justify-center group rounded-sm" 
                style={{ borderTopColor: card.color }}
              >
                <div className="text-4xl mb-4 text-[var(--primary-color)] group-hover:scale-110 transition-transform">🏛️</div> 
                <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors">
                  {card.title}
                </h3>
              </div>
            ))}
          </div>

          {/* SISI KANAN: Kotak Hero */}
          <div className="relative w-full min-h-[350px] bg-[var(--primary-color)] shadow-2xl border-t-[6px] border-[var(--accent-gold)] overflow-hidden rounded-sm">
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                  index === currentSlide 
                    ? "opacity-100 translate-x-0 z-10 pointer-events-auto" 
                    : "opacity-0 translate-x-8 z-0 pointer-events-none"
                }`}
              >
                <span className="text-xs font-bold tracking-widest text-[var(--accent-gold)] uppercase block mb-3">
                  {slide.tagline}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight tracking-tight text-white">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-gray-200">
                  {slide.description}
                </p>

                <div className="mt-8">
                  <button className="px-6 py-2.5 bg-white/10 hover:bg-[var(--accent-gold)] hover:text-slate-900 text-white font-bold text-xs tracking-widest uppercase transition-colors duration-300 border border-white/20 rounded-sm">
                    Selengkapnya
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}