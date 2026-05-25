'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- KODE PENJAGA TOMBOL BACK ---
  useEffect(() => {
    // Deteksi jika browser memuat halaman dari cache masa lalu (BFCache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Jika ya, paksa muat ulang agar menabrak tembok Middleware
        window.location.reload(); 
      }
    };
    
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);
  // ---------------------------------

  if (pathname === '/auth') {
  return <>{children}</>;
}

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}