'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, LogOut, ChevronDown, Key, X } from 'lucide-react';

export default function Topbar({ sidebarOpen, setSidebarOpen }: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState({ username: 'Memuat...', role: '...' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State untuk Modal Ubah Password
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Ambil profil saat dimuat
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setAdminData({ username: data.user.username, role: data.user.role });
        }
      } catch (err) {
        console.error("Gagal memuat profil", err);
      }
    }
    fetchProfile();
  }, []);

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fungsi Keluar Aplikasi
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.replace('/auth');
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  // Fungsi Kirim Form Ubah Password
  // Fungsi Kirim Form Ubah Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    // Cek kecocokan konfirmasi password
    if (newPassword !== confirmPassword) {
      return setPassError('Konfirmasi password baru tidak cocok!');
    }

    // Cek kombinasi keamanan menggunakan Regex di sisi Frontend
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setPassError('Password baru harus mengandung huruf besar, huruf kecil, dan angka!');
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);

      setPassSuccess('Password berhasil diubah! Anda akan dialihkan...');
      
      // Tunggu 1,5 detik, lalu alihkan ke login
      setTimeout(() => {
        window.location.replace('/auth');
      }, 1500);

    } catch (err: any) {
      setPassError(err.message);
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-sm border-b border-slate-200">
        <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
          
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="block rounded-sm border border-slate-200 bg-white p-1.5">
              <Menu size={20} />
            </button>
          </div>

          <div className="hidden sm:block"></div>

          <div className="flex items-center gap-4 2xl:gap-7">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-amber-600 transition">
              <Bell size={20} />
            </button>
            
            <div className="relative pl-4 border-l border-slate-200" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 cursor-pointer group focus:outline-none"
              >
                <span className="hidden text-right lg:block">
                  <span className="block text-sm font-bold text-slate-800 capitalize group-hover:text-red-900 transition-colors">
                    {adminData.username}
                  </span>
                  <span className="block text-xs font-medium text-slate-500 tracking-wider">
                    {adminData.role.replace('_', ' ')}
                  </span>
                </span>
                
                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-amber-500 group-hover:bg-red-950 transition-colors">
                  <User size={20} />
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-xl border border-slate-100 bg-white shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-50 lg:hidden">
                    <p className="text-sm font-bold text-slate-800 capitalize">{adminData.username}</p>
                    <p className="text-xs text-slate-500">{adminData.role}</p>
                  </div>
                  
                  {/* Tombol Ubah Password */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Key size={16} />
                    Ubah Password
                  </button>

                  {/* Tombol Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                  >
                    <LogOut size={16} />
                    Keluar Aplikasi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MODAL UBAH PASSWORD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Key size={18} className="text-amber-500" />
                Ubah Kata Sandi
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {passError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center font-medium">
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg text-center font-medium">
                  {passSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password Lama</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                  placeholder="Masukkan password saat ini"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password Baru</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                  placeholder="Ketik ulang password baru"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passLoading || !!passSuccess}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-500 font-bold tracking-wider uppercase text-sm rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {passLoading ? 'Memproses...' : 'Simpan Password Baru'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}