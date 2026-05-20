// Import semua komponen section
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import News from "@/components/News";
import Videos from "@/components/Videos";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Render Hero Section */}
      <Hero />

      {/* Render Events Section */}
      <Events />

      {/* Render News Section */}
      <News />

      {/* Render Videos Section */}
      <Videos />
    </main>
  );
}