'use client';
import { useState, useEffect, useRef } from "react";
import { Mountain, Search, ChevronDown, X } from "lucide-react"; // Tambahkan icon X

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false); // State untuk fungsi search
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref untuk auto-focus

  // Efek mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek otomatis fokus ke kolom input saat search ditekan
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white text-slate-800 shadow-md py-3" 
        /* FADE MULTI-STEP: Putih Murni -> 80% -> 60% -> Transparan */
        : "bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0.8)_45%,rgba(255,255,255,0.6)_75%,rgba(255,255,255,0)_100%)] text-slate-800 py-4 pb-14"
    }`}>
      {/* BARIS ATAS (Utility Menu) */}
      <div className={`text-xs pb-2 border-b transition-colors duration-300 ${
        isScrolled ? "border-gray-100 text-gray-500" : "border-gray-200 text-gray-600"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-end items-center space-x-6 h-8">
          <button className="hover:text-[var(--primary-color)] flex items-center font-semibold tracking-wider uppercase transition-colors">
            I Want To... <ChevronDown size={12} className="ml-1"/>
          </button>
          <button className="hover:text-[var(--primary-color)] flex items-center font-semibold tracking-wider uppercase transition-colors">
            How Do I... <ChevronDown size={12} className="ml-1"/>
          </button>
          
          {/* KOMPONEN SEARCH INTERAKTIF */}
          <div className="flex items-center transition-all duration-300 ease-in-out">
            {isSearchActive ? (
              <div className="flex items-center bg-white border border-[var(--primary-color)] rounded-full px-3 py-1.5 shadow-sm w-48 md:w-64 transition-all">
                <Search size={14} className="text-[var(--primary-color)]" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Ketik kata kunci..." 
                  className="w-full bg-transparent outline-none text-xs font-medium text-slate-800 ml-2 placeholder-gray-400"
                />
                <button 
                  onClick={() => setIsSearchActive(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => setIsSearchActive(true)}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full cursor-pointer transition ${
                  isScrolled ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-100/80 hover:bg-gray-200/80"
                }`}
              >
                <Search size={12} />
                <span className="font-semibold tracking-wider uppercase">Search</span>
              </div>
            )}
          </div>
          {/* AKHIR KOMPONEN SEARCH */}

        </div>
      </div>

      {/* NAVIGASI UTAMA */}
      <div className="max-w-7xl mx-auto px-6 mt-3 flex justify-between items-center">
        {/* Logo Instansi */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <Mountain className="text-[var(--primary-color)]" size={32} />
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase leading-none text-[var(--primary-color)]">PORTAL UTAMA</h1>
            <p className="text-[9px] tracking-widest font-bold uppercase mt-1 text-gray-500">Pemerintah Wilayah</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-8 text-lg font-bold tracking-wider uppercase text-gray-700">
            <li><a href="#" className="hover:text-[var(--primary-color)] pb-1 border-b-2 border-transparent hover:border-[var(--accent-gold)] transition">Pemerintahan</a></li>
            <li><a href="#" className="hover:text-[var(--primary-color)] pb-1 border-b-2 border-transparent hover:border-[var(--accent-gold)] transition">Layanan Publik</a></li>
            <li><a href="#" className="hover:text-[var(--primary-color)] pb-1 border-b-2 border-transparent hover:border-[var(--accent-gold)] transition">Jelajahi Kota</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}