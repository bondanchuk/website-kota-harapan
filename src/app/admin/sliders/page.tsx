'use client';
import { useState, useEffect } from 'react';
import { MonitorPlay, Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function SliderManagement() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/admin/sliders');
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : []);
    } catch (e) { 
      console.error(e); 
      setSliders([]); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchSliders(); }, []);

  const handleOpenForm = (slider: any = null) => {
    if (slider) {
      setIsEditing(true); setCurrentId(slider.id);
      setTitle(slider.title); setSubtitle(slider.subtitle || ''); 
      setLink(slider.link || ''); setOrder(slider.order); setStatus(slider.status);
    } else {
      setIsEditing(false); setCurrentId(null);
      setTitle(''); setSubtitle(''); setLink(''); 
      setOrder(sliders.length + 1); setStatus('');
    }
    setImageFile(null);
    setView('form');
  };

  const handleDelete = async (id: string, sliderTitle: string) => {
    if (!confirm(`Hapus slider "${sliderTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSliders(); else alert('Gagal menghapus');
    } catch (e) { alert('Kesalahan server'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return alert('Silakan pilih status Publish/Draft!');
    if (!isEditing && !imageFile) return alert('Gambar wajib diunggah untuk slider baru!');
    
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('link', link);
    formData.append('order', order.toString());
    formData.append('status', status);
    if (imageFile) formData.append('image', imageFile);

    const endpoint = isEditing ? `/api/admin/sliders/${currentId}` : '/api/admin/sliders';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, { method, body: formData });
      if (res.ok) {
        setView('list'); fetchSliders();
      } else {
        const data = await res.json(); alert(data.message);
      }
    } catch (err) { alert('Terjadi kesalahan server'); } 
    finally { setIsSubmitting(false); }
  };

  if (view === 'form') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
          <button onClick={() => setView('list')} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Ubah Slider Banner' : 'Tambah Slider Banner Baru'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Besar *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Cth: Pemilu Serentak 2026" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sub-Judul (Opsional)</label>
              <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Cth: Gunakan Hak Pilih Anda" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Link Tujuan (Opsional)</label>
              <input type="text" value={link} onChange={e => setLink(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Cth: /halaman/sejarah-pemilu" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Urutan Tampil *</label>
              <input type="number" required value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-red-900 mb-2">Gambar Slider {isEditing ? '(Opsional)' : '*'}</label>
              <div className="flex items-center gap-0 w-full border border-slate-300 rounded-lg overflow-hidden bg-white">
                <label className="px-4 py-3 bg-slate-100 border-r border-slate-300 text-slate-700 font-medium text-sm cursor-pointer hover:bg-slate-200">
                  Pilih File
                  <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                <span className="px-4 text-sm text-slate-500 truncate">{imageFile ? imageFile.name : 'Resolusi disarankan: 1920x1080px'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-red-900 mb-2">Status *</label>
              <select required value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white">
                <option value="" disabled>-- Pilih --</option>
                <option value="publish">Publish (Tayang)</option>
                <option value="draft">Draft (Simpan Sementara)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
            <button type="button" onClick={() => setView('list')} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 font-bold rounded-lg uppercase tracking-wider hover:shadow-lg border border-amber-500/30 transition-all">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Slider'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><MonitorPlay className="text-amber-600" /> Manajemen Slider</h2>
          <p className="text-sm text-slate-500 mt-1">Atur gambar banner (carousel) yang muncul di beranda utama.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg border border-amber-500/30">
          <Plus size={18} /> Tambah Slider
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
              <tr>
                <th className="px-6 py-4">Gambar</th><th className="px-6 py-4">Informasi Slider</th><th className="px-6 py-4 text-center">Urutan</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="text-center py-10">Memuat...</td></tr> : 
               Array.isArray(sliders) && sliders.length === 0 ? <tr><td colSpan={5} className="text-center py-10">Belum ada slider banner.</td></tr> : 
               Array.isArray(sliders) ? sliders.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt={s.title} className="w-24 h-12 object-cover rounded shadow-sm border border-slate-200" />
                      ) : (
                        <div className="w-24 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-400"><ImageIcon size={16}/></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{s.title}</div>
                      {s.subtitle && <div className="text-xs text-slate-500 mt-1">{s.subtitle}</div>}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-lg text-slate-700">{s.order}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${s.status === 'publish' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenForm(s)} className="p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(s.id, s.title)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded"><Trash2 size={18} /></button>
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