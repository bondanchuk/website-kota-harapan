'use client';
import { useState, useEffect } from "react";
import { Video, ChevronUp } from "lucide-react"; 
import { usePathname } from 'next/navigation';

// --- KUMPULAN KOMPONEN SVG UNTUK IKON SOSIAL MEDIA ---
const FacebookIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);
// ------------------------------------------------------

export default function Footer() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Deteksi scroll untuk menampilkan tombol
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi klik scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return null;
  }

  

  return (
    <>
      <footer className="bg-slate-900 text-white py-10 mt-0 border-t border-white/5 font-sans relative z-40">
        {/* LEBAR FOOTER DISESUAIKAN (max-w-[1600px]) */}
        <div className="max-w-[1600px] mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-8 space-y-6 md:space-y-0">
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <h3 className="text-base font-extrabold text-white tracking-wide uppercase">TOWN HALL</h3>
              <p className="leading-relaxed">
                601 Center Circle, P.O. Box 1309 <br />
                Silverthorne, CO 80498
              </p>
              <p className="text-xs pt-1 font-medium text-gray-500">
                Telp: (970) 262-7300 | Email: info@silverthorne.org
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end space-y-4">
              <nav>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold tracking-wider uppercase text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Emergency Contacts</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Media Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </nav>

              <div className="flex items-center space-x-4 text-gray-400">
                <a href="#" className="hover:text-[var(--accent-gold)] transition-colors"><FacebookIcon size={18} /></a>
                <a href="#" className="hover:text-[var(--accent-gold)] transition-colors"><InstagramIcon size={18} /></a>
                <a href="#" className="hover:text-[var(--accent-gold)] transition-colors"><TwitterIcon size={18} /></a>
                <a href="#" className="hover:text-[var(--accent-gold)] transition-colors"><Video size={18} /></a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-[11px] text-gray-500 tracking-wide">
            <p className="text-center sm:text-left mb-2 sm:mb-0">
              &copy; {new Date().getFullYear()} Town of Silverthorne. All Rights Reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Policies & Accessibility</a>
              <a href="#" className="hover:underline">Sitemap</a>
            </div>
          </div>

        </div>
      </footer>

      {/* TOMBOL SCROLL TO TOP MELAYANG */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-[var(--primary-color)] hover:bg-[var(--accent-gold)] hover:text-slate-900 text-white p-3 md:p-4 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  );
}