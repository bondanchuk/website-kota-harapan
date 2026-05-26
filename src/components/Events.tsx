'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Events() {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Data dari Database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/agendas-public');
        const data = await res.json();
        if (Array.isArray(data)) setEventsData(data);
      } catch (error) {
        console.error("Gagal memuat data agenda:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Logika Pembuat Kalender Dinamis
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarCells = [];
  // Tanggal bulan sebelumnya (untuk mengisi kekosongan awal)
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDays - i, isCurrentMonth: false, date: null });
  }
  // Tanggal bulan ini
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, isCurrentMonth: true, date: new Date(currentYear, currentMonth, i) });
  }
  // Tanggal bulan depannya (agar grid selalu genap 42 kotak / 6 baris)
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false, date: null });
  }

  // Cek apakah suatu tanggal memiliki agenda di database
  const hasEvent = (dateObj: Date) => {
    return eventsData.some(ev => {
      const d = new Date(ev.eventDate);
      return (
        d.getDate() === dateObj.getDate() &&
        d.getMonth() === dateObj.getMonth() &&
        d.getFullYear() === dateObj.getFullYear()
      );
    });
  };

  // Navigasi Bulan
  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(prev => prev - 1); } 
    else { setCurrentMonth(prev => prev - 1); }
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(prev => prev + 1); } 
    else { setCurrentMonth(prev => prev + 1); }
  };

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const shortMonths = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];

  return (
    <section className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* =========================================================
              BAGIAN KIRI: KALENDER INTERAKTIF (Struktur Asli Dipertahankan)
              ========================================================= */}
          <div className="col-span-12 lg:col-span-5 flex flex-col w-full">
            <h2 className="text-xl md:text-2xl font-black text-[var(--primary-color)] mb-6 md:mb-8 tracking-tight uppercase border-b-2 border-[var(--accent-gold)] pb-2 self-start">
              KALENDER KEGIATAN RESMI
            </h2>
            
            <div className="bg-slate-50 p-5 md:p-8 border border-slate-200 shadow-sm w-full rounded-sm">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--accent-gold)] opacity-10 rounded-bl-[100%] pointer-events-none"></div>

              {/* Header Navigasi Kalender */}
              <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-t-sm">
                <button onClick={handlePrevMonth} className="hover:text-[var(--accent-gold)] transition-colors px-2">◀</button>
                <span className="font-bold tracking-widest text-sm uppercase">
                  {months[currentMonth]} {currentYear}
                </span>
                <button onClick={handleNextMonth} className="hover:text-[var(--accent-gold)] transition-colors px-2">▶</button>
              </div>

              {/* Label Hari */}
              <div className="grid grid-cols-7 gap-2 bg-slate-100 p-3 text-[10px] md:text-xs font-black text-slate-500 text-center uppercase tracking-wider">
                <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
              </div>

              {/* Grid Angka Tanggal */}
              <div className="grid grid-cols-7 gap-y-3 md:gap-y-4 gap-x-1 md:gap-x-2 text-center text-xs md:text-base font-bold">
                {calendarCells.map((cell, idx) => {
                  // Jika bukan bulan ini, tampilkan warna redup (abu-abu)
                  if (!cell.isCurrentMonth) {
                    return <div key={idx} className="text-center py-2 text-slate-300">{cell.day}</div>;
                  }

                  // Jika ada event di tanggal tersebut
                  if (hasEvent(cell.date!)) {
                    return (
                      <div key={idx} className="text-center py-2 bg-[var(--primary-color)] text-white font-bold rounded-sm shadow-md cursor-pointer hover:scale-105 transition-transform relative">
                        {cell.day}
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-gold)] rounded-full animate-pulse"></span>
                      </div>
                    );
                  }

                  // Tanggal biasa
                  return (
                    <div key={idx} className="text-center py-2 text-slate-600 font-medium hover:bg-slate-50 cursor-pointer rounded-sm">
                      {cell.day}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* =========================================================
              BAGIAN KANAN: DAFTAR AGENDA DINAMIS
              ========================================================= */}
          <div className="col-span-12 lg:col-span-7 flex flex-col w-full">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6 md:mb-8 tracking-tight uppercase border-b-2 border-slate-100 pb-2">
              AGENDA <span className="text-[var(--primary-color)]">TERDEKAT</span>
            </h2>
            
            <div className="flex flex-col space-y-5 md:space-y-6">
              
              {isLoading ? (
                <div className="text-slate-400 py-10">Memuat agenda...</div>
              ) : eventsData.length === 0 ? (
                <div className="text-slate-400 py-10 italic">Belum ada agenda terdaftar saat ini.</div>
              ) : (
                // Hanya menampilkan 3 agenda teratas agar tata letak tidak kepanjangan
                eventsData.slice(0, 3).map((event) => {
                  const dateObj = new Date(event.eventDate);
                  const day = dateObj.getDate().toString().padStart(2, '0');
                  const month = shortMonths[dateObj.getMonth()];
                  const time = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

                  return (
                    <div key={event.id} className="flex items-center gap-5 md:gap-6 group cursor-pointer border-b border-gray-100 pb-5 md:pb-6 last:border-0 last:pb-0">
                      
                      {/* Kotak Tanggal */}
                      <div className="bg-slate-900 text-white text-center py-3 md:py-4 w-[85px] md:w-[95px] group-hover:bg-[var(--primary-dark, #7f1d1d)] transition-colors rounded-sm flex-none">
                        <span className="font-bold text-lg">{day}</span> <br /> 
                        <span className="text-[10px] md:text-xs text-[var(--accent-gold)] tracking-widest">{month}</span>
                      </div>
                      
                      {/* Teks Agenda */}
                      <div className="flex-1">
                        <p className="text-[10px] md:text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
                          {time} {event.location ? `— ${event.location}` : ''}
                        </p>
                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                      </div>
                      
                      {/* Panah (Hanya Tampil di Desktop) */}
                      <span className="text-slate-300 text-xl md:text-2xl group-hover:text-[var(--accent-gold)] transition-colors hidden sm:block">➔</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Tombol More Events */}
            {eventsData.length > 0 && (
              <div className="pt-6 flex justify-start">
                <Link href="/events" className="px-5 py-2.5 md:px-6 md:py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-[var(--primary-color)] hover:text-white transition-colors duration-300 rounded-sm">
                  Lihat Semua Agenda
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}