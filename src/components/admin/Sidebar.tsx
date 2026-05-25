'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Shield, Menu as MenuIcon, X, Settings, FileText, Folder, Layout, Calendar, Image, Video, Layers, Map } from 'lucide-react';

export default function Sidebar({ sidebarOpen, setSidebarOpen }: any) {
  const pathname = usePathname();

  // Pengelompokan Menu sesuai rancangan CMS Website Pemerintahan
  const menuGroups = [
    {
      title: 'Ringkasan',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      ]
    },
    {
      title: 'Konten Web',
      items: [
        { name: 'Kategori Blog', icon: Folder, path: '/admin/blog-categories' },
        { name: 'Blog Post (Berita)', icon: FileText, path: '/admin/blog-posts' },
        { name: 'Halaman Web', icon: Layout, path: '/admin/pages' },
        { name: 'Slider & Hero', icon: Image, path: '/admin/sliders' },
        { name: 'Agenda & Event', icon: Calendar, path: '/admin/events' },
        { name: 'Galeri Foto', icon: Image, path: '/admin/gallery-photos' },
        { name: 'Galeri Video', icon: Video, path: '/admin/gallery-videos' },
        { name: 'Manajemen Layanan', icon: Layers, path: '/admin/services' },
        { name: 'Tanjungpinang Dalam Peta', icon: Map, path: '/admin/map-tpi' },
      ]
    },
    {
      title: 'Pengaturan CMS',
      items: [
        { name: 'Users / Pengguna', icon: Users, path: '/admin/users' },
        { name: 'Hak Akses (Role)', icon: Shield, path: '/admin/roles' },
        { name: 'Menu & Sub Menu', icon: MenuIcon, path: '/admin/web-menus' },
      ]
    }
  ];

  return (
    <aside className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-slate-950 duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6 border-b border-slate-900">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="bg-red-900/50 p-2 rounded-lg border border-amber-500/30">
            <Shield className="text-amber-500" size={24} />
          </div>
          <div>
            <h1 className="text-md font-black text-slate-100 tracking-wider">CMS PORTAL</h1>
            <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Pemerintahan Daerah</p>
          </div>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear flex-1 pb-6">
        <nav className="mt-5 px-4 py-2 lg:px-6 space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="mb-2 ml-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">{group.title}</h3>
              <ul className="flex flex-col gap-1">
                {group.items.map((item, index) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={index}>
                      <Link 
                        href={item.path} 
                        className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium duration-200 ease-in-out hover:bg-slate-900 hover:text-amber-500 ${isActive ? 'bg-red-950/40 text-amber-500 border-l-2 border-amber-500' : 'text-slate-400'}`}
                      >
                        <item.icon size={18} className={isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-amber-500'} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}