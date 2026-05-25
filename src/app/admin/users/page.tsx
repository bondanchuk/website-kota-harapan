'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, Check, ToggleLeft, ShieldAlert } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // State Isian Input
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [status, setStatus] = useState(true);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [resUsers, resRoles] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/roles')
      ]);
      const dataUsers = await resUsers.json();
      const dataRoles = await resRoles.json();
      setUsers(dataUsers);
      setRoles(dataRoles);
    } catch (err) {
      console.error('Gagal mengambil data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentUserId(null);
    setName(''); setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setRoleId(roles[0]?.id || ''); setStatus(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(''); // Kosongkan, hanya diisi jika ingin merubah password
    setConfirmPassword('');
    setRoleId(user.roleId);
    setStatus(user.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: string, uname: string) => {
    if (uname === 'admin_kepri') return alert('Akun inti sistem tidak dapat dihapus.');
    if (!confirm(`Hapus pengguna "${uname}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) { loadData(); } else { const d = await res.json(); alert(d.message); }
    } catch (e) { alert('Terjadi kesalahan sistem'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isEditing && password !== confirmPassword) {
      return setFormError('Konfirmasi kata sandi tidak cocok!');
    }

    setIsSubmitting(true);
    const url = isEditing ? `/api/admin/users/${currentUserId}` : '/api/admin/users';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, confirmPassword, roleId, status }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      } else {
        setFormError(data.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      setFormError('Kesalahan koordinasi jaringan server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-amber-600" /> Manajemen Pengguna (Users)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data akun staf operator dan administrator CMS.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:shadow-lg border border-amber-500/30"
        >
          <Plus size={18} /> Tambah Pengguna
        </button>
      </div>

      {/* DATA TABEL */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-800 font-bold">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Hak Akses (Role)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10">Memuat data pengguna...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10">Belum ada staf terdaftar.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold capitalize">
                        {user.role?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {user.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleOpenEditModal(user)} className="text-slate-400 hover:text-amber-600"><Edit size={18} /></button>
                        {user.username !== 'admin_kepri' ? (
                          <button onClick={() => handleDeleteUser(user.id, user.username)} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                        ) : (
                          <ShieldAlert size={16} className="text-slate-300" title="Sistem Utama Terkunci" />
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

      {/* MODAL FORM USERS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">{isEditing ? 'Ubah Profil Pengguna' : 'Tambah Akun Pengguna Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center font-medium">{formError}</div>}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nama Lengkap</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: Muhammad Rafli" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Username</label>
                  <input type="text" required disabled={isEditing && username === 'admin_kepri'} value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm disabled:opacity-50" placeholder="rafli_admin" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Resmi</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="operator@kpu.go.id" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{isEditing ? 'Sandi Baru (Opsional)' : 'Kata Sandi'}</label>
                  <input type="password" required={!isEditing} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="••••••" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{isEditing ? 'Konfirmasi Sandi Baru' : 'Konfirmasi Kata Sandi'}</label>
                  <input type="password" required={!isEditing && password !== ''} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="••••••" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tingkat Hak Akses (Role)</label>
                <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm capitalize">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-sm font-bold text-slate-700">Status Akun</span>
                  <span className="text-xs text-slate-500">Tentukan apakah pengguna dapat masuk log sistem atau tidak.</span>
                </div>
                <button type="button" onClick={() => setStatus(!status)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${status ? 'bg-red-900' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${status ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm">Batal</button>
                <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-red-950 to-red-900 text-amber-500 px-6 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase border border-amber-500/30">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}