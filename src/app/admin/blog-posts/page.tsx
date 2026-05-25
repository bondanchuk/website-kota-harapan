'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon, Folder } from 'lucide-react';
import dynamic from 'next/dynamic';

// 1. UBAH IMPORT CSS-NYA KE 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'; 

// 2. UBAH DYNAMIC IMPORT-NYA KE 'react-quill-new'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Konfigurasi Toolbar (Tombol-tombol pada editor, termasuk tombol Gambar)
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'], 
    ['clean']
  ],
};

// ... (SISA KODE DI BAWAHNYA TETAP SAMA PERSIS, TIDAK PERLU DIUBAH)

export default function BlogPostManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [status, setStatus] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [resPosts, resCats] = await Promise.all([
        fetch('/api/admin/blog-posts'),
        fetch('/api/admin/blog-categories')
      ]);
      const dataPosts = await resPosts.json();
      const dataCats = await resCats.json();
      
      setPosts(Array.isArray(dataPosts) ? dataPosts : []);
      setCategories(Array.isArray(dataCats) ? dataCats : []);
    } catch (e) { 
      console.error(e); 
      setPosts([]); setCategories([]);
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenForm = (post: any = null) => {
    if (post) {
      setIsEditing(true); setCurrentId(post.id);
      setTitle(post.title); setCategoryId(post.categoryId); 
      setContent(post.content || ''); setContentEn(post.contentEn || ''); 
      setStatus(post.status);
    } else {
      setIsEditing(false); setCurrentId(null);
      setTitle(''); setCategoryId(categories[0]?.id || ''); 
      setContent(''); setContentEn(''); setStatus('');
    }
    setImageFile(null);
    setView('form');
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!confirm(`Hapus berita "${postTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}`, { method: 'DELETE' });
      if (res.ok) loadData(); else alert('Gagal menghapus');
    } catch (e) { alert('Kesalahan server'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status || !categoryId) return alert('Kategori dan Status wajib dipilih!');
    // Validasi manual karena WYSIWYG sering menyimpan tag HTML kosong seperti "<p><br></p>"
    if (!content || content === '<p><br></p>') return alert('Konten Bahasa Indonesia wajib diisi!');

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('categoryId', categoryId);
    formData.append('content', content);
    formData.append('contentEn', contentEn); // Akan otomatis terkirim kosong jika tidak diisi
    formData.append('status', status);
    if (imageFile) formData.append('image', imageFile);

    const endpoint = isEditing ? `/api/admin/blog-posts/${currentId}` : '/api/admin/blog-posts';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, { method, body: formData });
      if (res.ok) {
        setView('list'); loadData();
      } else {
        const data = await res.json(); alert(data.message);
      }
    } catch (err) { alert('Terjadi kesalahan server'); } 
    finally { setIsSubmitting(false); }
  };

  // ---------------------------------------------------------
  // TAMPILAN FORMULIR BERITA (DENGAN WYSIWYG EDITOR)
  // ---------------------------------------------------------
  if (view === 'form') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
          <button onClick={() => setView('list')} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Ubah Artikel Berita' : 'Tulis Artikel Baru'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Berita *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Masukkan judul berita..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kategori *</label>
              <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white">
                <option value="" disabled>-- Pilih Kategori --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* WYSIWYG EDITOR 1: KONTEN INDONESIA */}
          <div className="pb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Konten (Bahasa Indonesia) *</label>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-300 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 h-[400px]">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={quillModules}
                className="h-[358px]" // Disesuaikan agar toolbar tidak memakan sisa ruang editor
                placeholder="Tulis isi berita atau sisipkan gambar di sini..."
              />
            </div>
          </div>

          {/* WYSIWYG EDITOR 2: KONTEN ENGLISH (TIDAK WAJIB) */}
          <div className="pb-8">
            <label className="block text-sm font-bold text-slate-700 mb-1">Konten (English)</label>
            <p className="text-xs text-slate-500 mb-2 italic">Opsional. Kosongkan jika tidak ada terjemahan.</p>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-300 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 h-[250px]">
              <ReactQuill 
                theme="snow" 
                value={contentEn} 
                onChange={setContentEn} 
                modules={quillModules}
                className="h-[208px]"
                placeholder="Write the english translation here (optional)..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-red-900 mb-2">Gambar Sampul Utama {isEditing ? '(Opsional)' : '*'}</label>
              <div className="flex items-center gap-0 w-full border border-slate-300 rounded-lg overflow-hidden bg-white">
                <label className="px-4 py-3 bg-slate-100 border-r border-slate-300 text-slate-700 font-medium text-sm cursor-pointer hover:bg-slate-200 transition-colors">
                  Pilih File
                  <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                <span className="px-4 text-sm text-slate-500 truncate">
                  {imageFile ? imageFile.name : 'Belum ada gambar dipilih'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-red-900 mb-2">Status Publikasi *</label>
              <select required value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white">
                <option value="" disabled>-- Tentukan Status --</option>
                <option value="publish">Publish (Tayang ke Publik)</option>
                <option value="draft">Draft (Simpan Sementara)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
            <button type="button" onClick={() => setView('list')} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 font-bold tracking-wider uppercase rounded-lg hover:shadow-lg transition-all border border-amber-500/30">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Berita'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------
  // TAMPILAN LIST BERITA (TABEL)
  // ---------------------------------------------------------
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-amber-600" /> Publikasi Berita
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelola dan terbitkan artikel, pengumuman, atau berita terbaru instansi.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg border border-amber-500/30">
          <Plus size={18} /> Tulis Berita
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
              <tr>
                <th className="px-6 py-4">Sampul</th>
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="text-center py-10">Memuat data berita...</td></tr> : 
               Array.isArray(posts) && posts.length === 0 ? <tr><td colSpan={5} className="text-center py-10">Belum ada berita yang diterbitkan.</td></tr> : 
               Array.isArray(posts) ? posts.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {p.image ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} className="w-16 h-10 object-cover rounded shadow-sm border border-slate-200" />
                      ) : (
                        <div className="w-16 h-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400"><ImageIcon size={16}/></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="text-[10px] font-mono text-emerald-600 mt-1">/berita/{p.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 w-max">
                        <Folder size={12} className="text-amber-600" /> {p.category?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${p.status === 'publish' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
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
                )) : null
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}