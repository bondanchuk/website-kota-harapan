'use client';
import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Plus, Edit, Trash2, X, CornerDownRight, Link as LinkIcon } from 'lucide-react';

export default function WebMenuManagement() {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Struktur Menu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState('');

  // State Modal Setting Link Baru
const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkType, setLinkType] = useState('page');
  const [linkTarget, setLinkTarget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [blogCategories, setBlogCategories] = useState<any[]>([]);
    const [webPages, setWebPages] = useState<any[]>([]);
    
    

  const loadAllData = async () => {
    try {
      const [resMenus, resCat, resPages] = await Promise.all([
        fetch('/api/admin/web-menus'),
        fetch('/api/admin/blog-categories'),
        fetch('/api/admin/pages')
      ]);

      const dataMenus = await resMenus.json();
      const dataCat = await resCat.json();
      const dataPages = await resPages.json();

      // PROTEKSI: Pastikan datanya adalah Array. Jika API error/me-return object, jadikan Array kosong [].
      setMenus(Array.isArray(dataMenus) ? dataMenus : []);
      setBlogCategories(Array.isArray(dataCat) ? dataCat : []);
      setWebPages(Array.isArray(dataPages) ? dataPages : []);
      
    } catch (error) {
      console.error('Gagal memuat data', error);
      // Jika fetch gagal total (misal server mati), pastikan state tetap berupa array kosong
      setMenus([]);
      setBlogCategories([]);
      setWebPages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  // Handler Modal Struktur
  const handleOpenAddModal = () => {
    setIsEditing(false); setCurrentMenuId(null);
    setTitle(''); setOrder(0); setParentId(''); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (menu: any) => {
    setIsEditing(true); setCurrentMenuId(menu.id);
    setTitle(menu.title); setOrder(menu.order); setParentId(menu.parentId || '');
    setIsModalOpen(true);
  };

  // Handler Modal Setting Link
  const handleOpenLinkModal = (menu: any) => {
    setCurrentMenuId(menu.id);
    setLinkType(menu.linkType || 'page');
    setLinkTarget(menu.linkTarget || '');
    setIsLinkModalOpen(true);
  };

  const handleDelete = async (id: string, menuTitle: string) => {
    if (!confirm(`Hapus menu "${menuTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/web-menus/${id}`, { method: 'DELETE' });
      if (res.ok) loadAllData(); else { const d = await res.json(); alert(d.message); }
    } catch (e) { alert('Kesalahan jaringan'); }
  };

  // Simpan Struktur Menu
  const handleSubmitStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint = isEditing ? `/api/admin/web-menus/${currentMenuId}` : '/api/admin/web-menus';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, order, parentId }), 
      });
      if (res.ok) { setIsModalOpen(false); loadAllData(); } 
      else { const data = await res.json(); alert(data.message); }
    } catch (err) { alert('Terjadi kesalahan server'); } 
    finally { setIsSubmitting(false); }
  };

  // Simpan Setting Link
  const handleSubmitLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Otomatis men-generate URL frontend berdasarkan tipe yang dipilih
    let generatedUrl = '#';
    if (linkType === 'page') generatedUrl = `/halaman/${linkTarget}`;
    else if (linkType === 'blog_category') generatedUrl = `/kategori-berita/${linkTarget}`;
    else if (linkType === 'gallery_photo') generatedUrl = `/galeri/foto`;
    else if (linkType === 'gallery_video') generatedUrl = `/galeri/video`;

    try {
      const res = await fetch(`/api/admin/web-menus/${currentMenuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkType, linkTarget, url: generatedUrl }),
      });
      
      if (res.ok) { setIsLinkModalOpen(false); loadAllData(); } 
      else { const data = await res.json(); alert(data.message); }
    } catch (err) { alert('Terjadi kesalahan server'); } 
    finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MenuIcon className="text-amber-600" /> Pengaturan Menu Web
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelola hierarki struktur dan rute tautan menu navigasi publik.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg border border-amber-500/30"
        >
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {/* TABEL DATA MENU */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
              <tr>
                <th className="px-6 py-4">Struktur Menu</th>
                <th className="px-6 py-4">Tingkat Menu</th>
                <th className="px-6 py-4">Target Tautan (URL)</th>
                <th className="px-6 py-4 text-center">Urutan</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="text-center py-10">Memuat...</td></tr> : menus.length === 0 ? <tr><td colSpan={5} className="text-center py-10">Belum ada menu.</td></tr> : 
                menus.map((parent) => (
                  <React.Fragment key={parent.id}>
                    {/* BARIS MENU UTAMA (ROOT) */}
                    <tr className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 uppercase">{parent.title}</td>
                      <td className="px-6 py-4"><span className="bg-slate-800 text-amber-500 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">Root Menu</span></td>
                      <td className="px-6 py-4 text-xs font-mono text-emerald-600 break-all">{parent.url || '-'}</td>
                      <td className="px-6 py-4 text-center font-bold text-lg">{parent.order}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => handleOpenEditModal(parent)} className="p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded" title="Ubah Struktur"><Edit size={16} /></button>
                          {/* Tombol Setting Link muncul JIKA ROOT INI TIDAK PUNYA SUB-MENU */}
                          {parent.subMenus.length === 0 && (
                            <button onClick={() => handleOpenLinkModal(parent)} className="p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-1" title="Setting Link">
                              <LinkIcon size={16} /> <span className="text-[10px] font-bold">LINK</span>
                            </button>
                          )}
                          <button onClick={() => handleDelete(parent.id, parent.title)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* BARIS SUB MENU */}
                    {parent.subMenus.map((sub: any) => (
                      <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 pl-12 text-slate-700 font-medium flex items-center gap-2">
                          <CornerDownRight size={16} className="text-slate-300" /> {sub.title}
                        </td>
                        <td className="px-6 py-3"><span className="text-slate-500 text-[11px] font-medium border border-slate-200 px-2 py-1 rounded bg-white">Sub Menu</span></td>
                        <td className="px-6 py-3 text-xs font-mono text-emerald-600 break-all">{sub.url || '-'}</td>
                        <td className="px-6 py-3 text-center font-semibold text-slate-600">{sub.order}</td>
                        <td className="px-6 py-3">
                          <div className="flex justify-center items-center gap-2">
                            <button onClick={() => handleOpenEditModal(sub)} className="p-1.5 text-slate-300 hover:bg-amber-50 hover:text-amber-600 rounded" title="Ubah Struktur"><Edit size={16} /></button>
                            {/* Sub menu pasti merupakan level terbawah, selalu munculkan Setting Link */}
                            <button onClick={() => handleOpenLinkModal(sub)} className="p-1.5 text-slate-300 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-1" title="Setting Link">
                              <LinkIcon size={16} /> <span className="text-[10px] font-bold">LINK</span>
                            </button>
                            <button onClick={() => handleDelete(sub.id, sub.title)} className="p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600 rounded" title="Hapus"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL STRUKTUR MENU (Sama seperti sebelumnya) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold">{isEditing ? 'Ubah Struktur Menu' : 'Tambah Menu Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmitStructure} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nama Menu</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none rounded-lg text-sm" placeholder="Contoh: Profil Kami" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Induk Menu (Parent)</label>
                <select value={parentId} onChange={e => setParentId(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none rounded-lg text-sm">
                  <option value="" className="font-bold">- Root (Menu Utama) -</option>
                  {menus.map(m => (<option key={m.id} value={m.id} disabled={currentMenuId === m.id}>↳ Di Bawah: {m.title}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nomor Urut</label>
                <input type="number" required value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none rounded-lg text-sm" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-red-950 text-amber-500 rounded-lg text-sm font-bold uppercase border border-amber-500/30">Simpan Struktur</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SETTING LINK (Modul Baru Sesuai Gambar) */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold flex items-center gap-2 text-slate-800">
                <LinkIcon size={18} className="text-blue-600" /> Setting Link Menu
              </h3>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmitLink} className="p-6 space-y-5">
              
              <div>
                <label className="block text-xs font-bold uppercase text-red-600 mb-1.5">Kategori Tujuan *</label>
                <select 
                  value={linkType} 
                  onChange={e => {
                    setLinkType(e.target.value);
                    // Reset target jika pindah ke kategori galeri karena galeri tidak butuh target spesifik
                    if(e.target.value === 'gallery_photo' || e.target.value === 'gallery_video') setLinkTarget('');
                  }} 
                  className="w-full px-4 py-3 bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-lg text-sm font-medium shadow-sm"
                >
                  <option value="page">Halaman Web (Web Page Baru)</option>
                  <option value="blog_category">Blog Kategori (Kumpulan Berita)</option>
                  <option value="gallery_photo">Galeri Foto</option>
                  <option value="gallery_video">Galeri Video</option>
                </select>
              </div>

              {/* Tampilkan dropdown dinamis HANYA jika tipenya butuh target spesifik */}
              {/* Tampilkan dropdown dinamis HANYA jika tipenya butuh target spesifik */}
              {(linkType === 'page' || linkType === 'blog_category') && (
                <div>
                  <label className="block text-xs font-bold uppercase text-red-600 mb-1.5">Arahkan Link Menu Ke *</label>
                  
                  <select 
                    required 
                    value={linkTarget} 
                    onChange={e => setLinkTarget(e.target.value)} 
                    className="w-full px-4 py-3 bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-lg text-sm text-slate-700 shadow-sm"
                  >
                    <option value="" disabled className="text-slate-400">
                      -- Pilih {linkType === 'page' ? 'Halaman Web' : 'Kategori Blog'} --
                    </option>
                    
                    {/* Render opsi Halaman Web dengan aman */}
                    {linkType === 'page' && Array.isArray(webPages) && webPages.length === 0 && (
                      <option value="" disabled>Belum ada Halaman Web yang dibuat.</option>
                    )}
                    {linkType === 'page' && Array.isArray(webPages) && webPages.map(page => (
                      <option key={page.id} value={page.slug}>{page.title}</option>
                    ))}

                    {/* Render opsi Kategori Blog dengan aman */}
                    {linkType === 'blog_category' && Array.isArray(blogCategories) && blogCategories.length === 0 && (
                      <option value="" disabled>Belum ada Kategori Blog yang dibuat.</option>
                    )}
                    {linkType === 'blog_category' && Array.isArray(blogCategories) && blogCategories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                  
                  <p className="text-[10px] text-slate-500 mt-2 italic">
                    Pilihan ini mengambil data asli dari modul {linkType === 'page' ? 'Halaman Web' : 'Manajemen Blog'}.
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsLinkModalOpen(false)} className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-sm font-bold transition-colors">
                  Kembali
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#42b883] hover:bg-[#339e6e] text-white rounded-md text-sm font-bold transition-colors shadow-sm">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}