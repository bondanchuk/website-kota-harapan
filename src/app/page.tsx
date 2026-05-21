import Hero from "@/components/Hero";
import News from "@/components/News";
import Events from "@/components/Events"; 
import Videos from "@/components/Videos";
import MapSection from "@/components/MapSection"; // 1. Import komponen peta baru

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner (Kartu 3x3 & Informasi Utama) */}
      <Hero />

      {/* 2. Segmen Berita (Terbaru 4 Kolom & Terpopuler 5 Kolom) */}
      <News />

      {/* 3. Segmen Agenda & Kalender Bersatu */}
      <Events />

      {/* 4. Galeri Video Terpadu */}
      <Videos />

      {/* 5. Segmen Peta Interaktif Terpadu (Berada di bawah segmen video) */}
      <MapSection />
    </main>
  );
}