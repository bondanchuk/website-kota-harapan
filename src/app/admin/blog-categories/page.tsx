'use client';
import { useState, useEffect } from 'react';
import { Folder, Plus, Edit, Trash2, X } from 'lucide-react';

export default function BlogCategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/blog-categories');
      const data = await res.json();
      // PROTEKSI: Pastikan data yang diterima adalah Array. Jika error, jadikan []
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) { 
      console.error(e); 
      setCategories([]); // Fallback aman jika fetch gagal
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenAdd = () => {
    setIsEditing(false); setCurrentId(null); setName(''); setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setIsEditing(true); setCurrentId(cat.id); setName(cat.name); setIsModalOpen(true);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Hapus kategori "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog-categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories(); else { const d = await res.json(); alert(d.message); }
    } catch (e) { alert('Kesalahan jaringan'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint = isEditing ? `/api/admin/blog-categories/${currentId}` : '/api/admin/blog-categories';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setIsModalOpen(false); fetchCategories();
      } else {
        const data = await res.json(); alert(data.message);
      }
    } catch (err) { alert('Terjadi kesalahan server'); } 
    finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Folder className="text-amber-600" /> Kategori Blog
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelompokkan berita atau artikel Anda ke dalam kategori spesifik.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg border border-amber-500/30"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
            <tr>
              <th className="px-6 py-4">Nama Kategori</th>
              <th className="px-6 py-4">URL Slug</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={3} className="text-center py-10">Memuat...</td></tr> : 
             Array.isArray(categories) && categories.length === 0 ? <tr><td colSpan={3} className="text-center py-10">Belum ada kategori.</td></tr> : 
             Array.isArray(categories) ? categories.map((cat) => (
                <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                  <td className="px-6 py-4 text-xs font-mono text-emerald-600">/kategori/{cat.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleOpenEdit(cat)} className="p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : null
            }
          </tbody>
        </table>
      </div>

      {/* MODAL FORM KATEGORI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold">{isEditing ? 'Ubah Kategori' : 'Tambah Kategori Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nama Kategori</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-lg text-sm" 
                  placeholder="Contoh: Berita Pemerintahan" 
                />
                <p className="text-[10px] text-slate-500 mt-2">URL slug akan dibuat secara otomatis berdasarkan nama ini.</p>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-red-950 text-amber-500 rounded-lg text-sm font-bold uppercase border border-amber-500/30">
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