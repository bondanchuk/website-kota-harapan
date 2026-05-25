'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function WebPageManagement() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // View State: 'list' | 'form'
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [status, setStatus] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      setPages(await res.json());
    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleOpenForm = (page: any = null) => {
    if (page) {
      setIsEditing(true); setCurrentId(page.id);
      setTitle(page.title); setContent(page.content || ''); 
      setContentEn(page.contentEn || ''); setStatus(page.status);
    } else {
      setIsEditing(false); setCurrentId(null);
      setTitle(''); setContent(''); setContentEn(''); setStatus('');
    }
    setImageFile(null);
    setView('form');
  };

  const handleDelete = async (id: string, pageTitle: string) => {
    if (!confirm(`Hapus halaman "${pageTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPages(); else alert('Gagal menghapus');
    } catch (e) { alert('Kesalahan server'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return alert('Silakan pilih status Publish!');
    setIsSubmitting(true);

    // Menggunakan FormData karena kita mengirim File Gambar
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('contentEn', contentEn);
    formData.append('status', status);
    if (imageFile) formData.append('image', imageFile);

    const endpoint = isEditing ? `/api/admin/pages/${currentId}` : '/api/admin/pages';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, { method, body: formData });
      if (res.ok) {
        setView('list'); fetchPages();
      } else {
        const data = await res.json(); alert(data.message);
      }
    } catch (err) { alert('Terjadi kesalahan server'); } 
    finally { setIsSubmitting(false); }
  };

  // ---------------------------------------------------------
  // TAMPILAN FORMULIR (Sesuai Gambar Referensi KPU)
  // ---------------------------------------------------------
  if (view === 'form') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
          <button onClick={() => setView('list')} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Ubah Halaman Web' : 'Tambah Halaman Web'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Judul *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-bold text-slate-700">Content *</label>
            </div>
            {/* Nantinya textarea ini bisa diganti komponen React-Quill atau TinyMCE */}
            <textarea required rows={8} value={content} onChange={e => setContent(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Masukkan konten Bahasa Indonesia..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Content English *</label>
            <textarea required rows={8} value={contentEn} onChange={e => setContentEn(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter English content..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-red-600 mb-2">Image {isEditing ? '(Abaikan jika tidak ingin mengubah)' : '*'}</label>
            <div className="flex items-center gap-0 w-full border border-slate-300 rounded-lg overflow-hidden bg-white">
              <label className="px-4 py-2.5 bg-slate-100 border-r border-slate-300 text-slate-700 font-medium text-sm cursor-pointer hover:bg-slate-200">
                Choose File
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </label>
              <span className="px-4 text-sm text-slate-500">
                {imageFile ? imageFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-red-600 mb-2">Publish *</label>
            <select required value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
              <option value="" disabled>-- Pilih --</option>
              <option value="publish">Publish (Tayang)</option>
              <option value="draft">Draft (Simpan Sementara)</option>
            </select>
          </div>

          <div className="pt-6 flex justify-center gap-4">
            <button type="button" onClick={() => setView('list')} className="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors">
              Kembali
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#42b883] text-white font-bold rounded-lg hover:bg-[#339e6e] transition-colors shadow-sm">
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------
  // TAMPILAN LIST (TABEL)
  // ---------------------------------------------------------
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-amber-600" /> Manajemen Halaman Web
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelola konten statis seperti Profil, Sejarah, atau Visi Misi.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg border border-amber-500/30">
          <Plus size={18} /> Tambah Halaman
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
              <tr>
                <th className="px-6 py-4">Gambar</th>
                <th className="px-6 py-4">Judul Halaman</th>
                <th className="px-6 py-4">Tautan URL (Slug)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="text-center py-10">Memuat...</td></tr> : pages.length === 0 ? <tr><td colSpan={5} className="text-center py-10">Belum ada halaman.</td></tr> : 
                pages.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {p.image ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} className="w-16 h-10 object-cover rounded shadow-sm" />
                      ) : (
                        <div className="w-16 h-10 bg-slate-200 rounded flex items-center justify-center text-slate-400"><ImageIcon size={16}/></div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{p.title}</td>
                    <td className="px-6 py-4 text-xs font-mono text-emerald-600">/halaman/{p.slug}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${p.status === 'publish' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenForm(p)} className="p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}