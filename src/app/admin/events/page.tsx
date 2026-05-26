'use client';
import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon, MapPin, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; 

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link'], 
    ['clean']
  ],
};

export default function AgendaManagement() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [status, setStatus] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAgendas = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      setAgendas(Array.isArray(data) ? data : []);
    } catch (e) { 
      setAgendas([]); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchAgendas(); }, []);

  const handleOpenForm = (agenda: any = null) => {
    if (agenda) {
      setIsEditing(true); setCurrentId(agenda.id);
      setTitle(agenda.title); setDescription(agenda.description || ''); 
      setLocation(agenda.location || ''); setStatus(agenda.status);
      
      // Format ISO datetime untuk input type="datetime-local"
      const dateObj = new Date(agenda.eventDate);
      dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
      setEventDate(dateObj.toISOString().slice(0, 16));
    } else {
      setIsEditing(false); setCurrentId(null);
      setTitle(''); setDescription(''); setLocation(''); 
      setEventDate(''); setStatus('');
    }
    setImageFile(null);
    setView('form');
  };

  const handleDelete = async (id: string, agendaTitle: string) => {
    if (!confirm(`Hapus agenda "${agendaTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAgendas(); else alert('Gagal menghapus');
    } catch (e) { alert('Kesalahan server'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status || !eventDate) return alert('Data belum lengkap!');
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('eventDate', new Date(eventDate).toISOString());
    formData.append('status', status);
    if (imageFile) formData.append('image', imageFile);

    const endpoint = isEditing ? `/api/admin/events/${currentId}` : '/api/admin/events';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, { method, body: formData });
      if (res.ok) {
        setView('list'); fetchAgendas();
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
            {isEditing ? 'Ubah Agenda' : 'Tambah Agenda Baru'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kegiatan / Agenda *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Cth: Rapat Koordinasi Penyusunan SOP Pemutakhiran Data" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Waktu Pelaksanaan *</label>
              <input type="datetime-local" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi (Opsional)</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Cth: Ruang Rapat Utama / Provinsi Maluku" />
            </div>
          </div>

          <div className="pb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Agenda (Opsional)</label>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-300 focus-within:border-amber-500 h-[250px]">
              <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} className="h-[208px]" placeholder="Tuliskan rincian agenda, peserta, atau persyaratan..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-red-900 mb-2">Poster Acara (Opsional)</label>
              <div className="flex items-center gap-0 w-full border border-slate-300 rounded-lg overflow-hidden bg-white">
                <label className="px-4 py-3 bg-slate-100 border-r border-slate-300 text-slate-700 font-medium text-sm cursor-pointer hover:bg-slate-200">
                  Pilih File
                  <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                <span className="px-4 text-sm text-slate-500 truncate">{imageFile ? imageFile.name : 'Belum ada gambar'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-red-900 mb-2">Status Publikasi *</label>
              <select required value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white">
                <option value="" disabled>-- Pilih --</option>
                <option value="publish">Publish (Tayang Publik)</option>
                <option value="draft">Draft (Disembunyikan)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
            <button type="button" onClick={() => setView('list')} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 font-bold rounded-lg uppercase tracking-wider hover:shadow-lg border border-amber-500/30 transition-all">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Agenda'}
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
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><CalendarDays className="text-amber-600" /> Manajemen Agenda & Event</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola jadwal kegiatan, rapat, atau acara penting.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg border border-amber-500/30">
          <Plus size={18} /> Tambah Agenda
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
              <tr>
                <th className="px-6 py-4">Acara</th><th className="px-6 py-4">Waktu & Lokasi</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={4} className="text-center py-10">Memuat...</td></tr> : 
               agendas.length === 0 ? <tr><td colSpan={4} className="text-center py-10">Belum ada agenda terdaftar.</td></tr> : 
               agendas.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {a.image ? (
                          <img src={a.image} alt="" className="w-12 h-12 object-cover rounded shadow-sm border border-slate-200" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-400"><ImageIcon size={16}/></div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{a.title}</div>
                          <div className="text-[10px] text-amber-600 font-mono mt-1">/agenda/{a.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1"><Clock size={12} className="text-amber-600" /> {new Date(a.eventDate).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={12} /> {a.location || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${a.status === 'publish' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{a.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenForm(a)} className="p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(a.id, a.title)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded"><Trash2 size={18} /></button>
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