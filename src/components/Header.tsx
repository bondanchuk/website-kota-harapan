'use client';
import { useState, useEffect } from "react";
import { Mountain, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);

  // Data Menu & Sub-Menu
  const navItems = [
    { title: 'Pemerintahan', sub: ['Visi & Misi', 'Struktur Organisasi', 'Profil Pejabat'] },
    { title: 'Layanan', sub: ['Perizinan Online', 'Pengaduan Masyarakat', 'Data Statistik'] },
    { title: 'Publikasi', sub: ['Berita Terbaru', 'Galeri Foto', 'Dokumen Resmi'] },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen 
        ? "bg-white text-slate-800 shadow-md py-4" 
        : "bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0.8)_45%,rgba(255,255,255,0)_100%)] text-slate-800 py-6"
    }`}>
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <Mountain className="text-[var(--primary-color)]" />
          <span>KOTA HARAPAN</span>
        </div>

        {/* NAV DESKTOP */}
        <nav className="hidden lg:flex">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.title} className="group relative">
                <button className="flex items-center gap-1 hover:text-[var(--primary-color)] font-medium transition py-2 border-b-2 border-transparent group-hover:border-[var(--accent-gold)]">
                  {item.title} <ChevronDown size={14} />
                </button>
                
                {/* Dropdown Desktop */}
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-gray-100 rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.sub.map((sub) => (
                    <Link key={sub} href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[var(--primary-color)]">
                      {sub}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* NAV MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col py-2 z-50">
          {navItems.map((item) => (
            <div key={item.title} className="border-b border-gray-50">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-sm font-bold uppercase text-gray-700"
                onClick={() => setOpenMobileSub(openMobileSub === item.title ? null : item.title)}
              >
                {item.title}
                <ChevronDown size={16} className={`transition-transform ${openMobileSub === item.title ? 'rotate-180' : ''}`} />
              </button>
              
              {openMobileSub === item.title && (
                <div className="bg-gray-50 px-6 py-2 flex flex-col gap-2">
                  {item.sub.map((sub) => (
                    <Link key={sub} href="#" className="text-sm text-gray-600 py-1 hover:text-[var(--primary-color)]">
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}