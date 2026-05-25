'use client';
import { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, X, Check } from 'lucide-react';

const MODULES = [
  { id: 'setting_users', name: '⚙️ Setting: Users' },
  { id: 'setting_roles', name: '⚙️ Setting: Role' },
  { id: 'setting_web_menu', name: '⚙️ Setting: Pengaturan Menu Web' },
  { id: 'blog_category', name: '📝 Blog: Kategori Blog' },
  { id: 'blog_post', name: '📝 Blog: Blog Post (Berita/Artikel)' },
  { id: 'web_pages', name: '📄 Manajemen Halaman Web' },
  { id: 'sliders', name: '🖼️ Manajemen SLIDER dan Hero' },
  { id: 'events', name: '📅 Agenda / Event Kalender' },
  { id: 'gallery_photo', name: '📷 Gallery: Photo' },
  { id: 'gallery_video', name: '🎥 Gallery: Video' },
  { id: 'services', name: '🤝 Manajemen Layanan (9 Card)' },
  { id: 'tpi_in_map', name: '🗺️ Manajemen Tanjungpinang Dalam Peta' },
];

const ACTIONS = ['add', 'edit', 'view', 'delete'];

export default function RoleManagement() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/admin/roles');
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error('Gagal memuat role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handlePermissionChange = (moduleId: string, action: string) => {
    setPermissions((prev) => {
      const currentModuleActions = prev[moduleId] || [];
      const hasAction = currentModuleActions.includes(action);

      let newActions;
      if (hasAction) {
        newActions = currentModuleActions.filter((a) => a !== action);
      } else {
        newActions = [...currentModuleActions, action];
      }

      return { ...prev, [moduleId]: newActions };
    });
  };

  // Memicu Modal untuk Mode Tambah Data Baru
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentRoleId(null);
    setFormData({ name: '' });
    setPermissions({});
    setIsModalOpen(true);
  };

  // Memicu Modal untuk Mode Ubah Data (Pre-fill Form)
  const handleOpenEditModal = (role: any) => {
    if (role.name === 'Super Admin') {
      alert('Role Super Admin utama sistem tidak dapat diubah demi keamanan.');
      return;
    }
    setIsEditing(true);
    setCurrentRoleId(role.id);
    setFormData({ name: role.name });
    setPermissions(role.permissions || {});
    setIsModalOpen(true);
  };

  // Menangani Fungsi Hapus Data
  const handleDeleteRole = async (id: string, name: string) => {
    if (name === 'Super Admin') {
      alert('Role Super Admin utama sistem tidak dapat dihapus.');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus role "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/roles/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        alert('Role berhasil dihapus.');
        fetchRoles();
      } else {
        alert(data.message || 'Gagal menghapus role.');
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem saat menghapus data.');
    }
  };

  // Menangani Pengiriman Formulir (Tambah & Ubah)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = isEditing ? `/api/admin/roles/${currentRoleId}` : '/api/admin/roles';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, permissions }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '' });
        setPermissions({});
        fetchRoles();
      } else {
        alert(data.message || 'Terjadi kesalahan saat menyimpan.');
      }
    } catch (error) {
      alert('Terjadi kesalahan koordinasi sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="text-amber-600" /> Manajemen Hak Akses (Role)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Atur tingkat kewenangan pengguna dalam sistem CMS.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-red-900/30 transition-all border border-amber-500/30"
        >
          <Plus size={18} /> Tambah Role
        </button>
      </div>

      {/* Tabel Role */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
              <tr>
                <th className="px-6 py-4">Nama Role</th>
                <th className="px-6 py-4">Total Modul Diakses</th>
                <th className="px-6 py-4">Tanggal Dibuat</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-10">Memuat data...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10">Belum ada role terdaftar.</td></tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{role.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        {Object.keys(role.permissions || {}).length} Modul
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(role.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        {role.name !== 'Super Admin' ? (
                          <>
                            <button 
                              onClick={() => handleOpenEditModal(role)}
                              className="text-slate-400 hover:text-amber-600 transition"
                              title="Ubah Hak Akses"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteRole(role.id, role.name)}
                              className="text-slate-400 hover:text-red-600 transition"
                              title="Hapus Role"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 italic">Dikunci Sistem</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM DINAMIS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">
                {isEditing ? `Ubah Konfigurasi Role: ${formData.name}` : 'Buat Role Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Role</label>
                <input
                  type="text"
                  required
                  disabled={isEditing} // Nama role terdaftar tidak disarankan diubah untuk menjaga integritas nama relasi di awal
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-60"
                  placeholder="Contoh: Staf Publikasi Berita"
                />
              </div>

              {/* Matriks Privilege */}
              <div className="mb-6 border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="px-4 py-3 border-r border-slate-200">Nama Modul</th>
                      {ACTIONS.map((action) => (
                        <th key={action} className="px-4 py-3 text-center capitalize">{action}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((mod) => (
                      <tr key={mod.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 border-r border-slate-200 font-medium text-slate-700">{mod.name}</td>
                        {ACTIONS.map((action) => {
                          const isChecked = (permissions[mod.id] || []).includes(action);
                          return (
                            <td key={`${mod.id}-${action}`} className="px-4 py-3 text-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={isChecked}
                                  onChange={() => handlePermissionChange(mod.id, action)}
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-red-900 border-red-900' : 'bg-white border-slate-300'}`}>
                                  {isChecked && <Check size={14} className="text-amber-500 font-bold" />}
                                </div>
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-6 py-2.5 rounded-lg font-bold tracking-wider uppercase border border-amber-500/30">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}