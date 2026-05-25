'use client';
import { Users, Map, FileText, Activity } from 'lucide-react';

export default function Dashboard() {
  const statCards = [
    { title: 'Total Pengguna', value: '1,240', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Titik Lokasi', value: '45', icon: Map, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Data Terpetakan', value: '8,302', icon: FileText, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Aktivitas Server', value: '99.9%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Ringkasan Sistem
        </h2>
      </div>

      {/* Grid Statistik ala TailAdmin */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
        {statCards.map((card, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bg}`}>
              <card.icon className={card.color} size={24} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-2xl font-bold text-slate-800">{card.value}</h4>
                <span className="text-sm font-medium text-slate-500">{card.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Area untuk Tabel atau Chart nantinya */}
      <div className="mt-6 md:mt-8 flex items-center justify-center h-96 rounded-xl border border-dashed border-slate-300 bg-slate-50">
        <p className="text-slate-500 font-medium">Area Visualisasi Data (Chart / Grafik) akan ditampilkan di sini.</p>
      </div>
    </>
  );
}