'use client';
import { useState, useEffect } from "react";
import { Mountain, Menu, X, ChevronDown } from "lucide-react"; 
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch('/api/menus');
        const data = await res.json();
        if (Array.isArray(data)) setMenus(data);
      } catch (error) {
        console.error("Gagal memuat menu:", error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen 
        ? "bg-white text-slate-800 shadow-md py-4" 
        : "bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0.8)_45%,rgba(255,255,255,0.6)_75%,rgba(255,255,255,0)_100%)] text-slate-800 py-6 pb-16"
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center relative">
        
        {/* Logo Instansi */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <Mountain className="text-[var(--primary-color, #b91c1c)]" size={32} />
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase leading-none text-[var(--primary-color, #b91c1c)]">PORTAL UTAMA</h1>
            <p className="text-[9px] tracking-widest font-bold uppercase mt-1 text-gray-500">Pemerintah Wilayah</p>
          </div>
        </Link>

        {/* --- MENU DESKTOP --- */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-8 text-sm font-bold tracking-wider uppercase text-slate-800">
            {menus.map((menu) => {
              // LOGIKA MENU AKTIF: Mencocokkan URL saat ini dengan tujuan menu
              const isActive = pathname === menu.url || (menu.url !== '/' && pathname.startsWith(menu.url));
              
              return (
                <li key={menu.id} className="relative group">
                  <Link 
                    href={menu.url || '#'} 
                    // STYLE AWAL ANDA: Jarak garis bawah yang presisi dengan `pb-1` dan `border-b-2`
                    className={`flex items-center gap-1.5 pb-1 border-b-2 transition ${
                      isActive 
                        ? 'text-[var(--primary-color)] border-[var(--accent-gold)]' 
                        : 'border-transparent hover:text-[var(--primary-color)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    {menu.title}
                    {menu.subMenus && menu.subMenus.length > 0 && (
                      <ChevronDown size={14} className={`${isActive ? 'text-[var(--primary-color)]' : 'text-slate-400'} group-hover:text-[var(--primary-color)] transition-transform duration-300 group-hover:-rotate-180`} />
                    )}
                  </Link>

                  {menu.subMenus && menu.subMenus.length > 0 && (
                    <div className="absolute top-full pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 z-50
                                    origin-top-left left-0 
                                    last-of-type:origin-top-right last-of-type:right-0 last-of-type:left-auto"
                    >
                      <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-gold)]"></div>
                        
                        <ul className="py-2 flex flex-col">
                          {menu.subMenus.map((sub: any) => {
                            const isSubActive = pathname === sub.url;
                            return (
                              <li key={sub.id}>
                                <Link 
                                  href={sub.url || '#'} 
                                  className={`block px-6 py-2.5 text-sm font-semibold capitalize transition-all duration-300 ${
                                    isSubActive 
                                      ? 'text-[var(--primary-color)] bg-slate-50 pl-8' 
                                      : 'text-slate-600 hover:text-[var(--primary-color)] hover:bg-slate-50 hover:pl-8'
                                  }`}
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tombol Hamburger Mobile */}
        <button 
          className="lg:hidden p-1 text-slate-800 hover:text-[var(--primary-color)] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* --- MENU MOBILE --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col py-2 z-50 max-h-[75vh] overflow-y-auto">
          <nav className="flex flex-col">
            {menus.map((menu) => {
              const isActive = pathname === menu.url || (menu.url !== '/' && pathname.startsWith(menu.url));
              
              return (
                <div key={menu.id}>
                  <Link 
                    href={menu.url || '#'} 
                    // STYLE AWAL ANDA: Mobile dengan padding presisi
                    className={`block px-6 py-4 border-b border-gray-50 text-sm font-bold tracking-wider uppercase hover:bg-gray-50 transition-colors ${
                      isActive ? 'text-[var(--primary-color)] bg-red-50/20' : 'text-gray-700 hover:text-[var(--primary-color)]'
                    }`}
                  >
                    {menu.title}
                  </Link>
                  
                  {menu.subMenus && menu.subMenus.length > 0 && (
                    <div className="bg-slate-50/50 flex flex-col border-b border-gray-100">
                      {menu.subMenus.map((sub: any) => {
                        const isSubActive = pathname === sub.url;
                        return (
                          <Link 
                            key={sub.id} 
                            href={sub.url || '#'} 
                            className={`block px-10 py-3.5 text-sm font-semibold transition-colors border-b border-gray-100/50 last:border-none ${
                              isSubActive ? 'text-[var(--primary-color)] bg-slate-100' : 'text-slate-500 hover:text-[var(--primary-color)] hover:bg-slate-100'
                            }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}