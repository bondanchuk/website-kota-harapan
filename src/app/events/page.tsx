'use client';
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Info } from "lucide-react";

export default function KalenderKegiatanPublik() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  // Ambil seluruh agenda dari API Publik
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/agendas-public');
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      } catch (error) {
        console.error("Gagal memuat data agenda:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Nama-nama bulan dalam Bahasa Indonesia
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Navigasi Bulan Kalender
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Logika Pembentukan Grid Tanggal Kalender
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Hari pertama dimulai dari indeks berapa (0 = Minggu)

  const calendarCells = [];
  // Isi slot kosong untuk hari sebelum tanggal 1
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Isi tanggal aktif bulan berjalan
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(new Date(currentYear, currentMonth, i));
  }

  // Fungsi utilitas untuk mencocokkan apakah dua tanggal jatuh di hari yang sama
  const isSameDay = (dateA: Date | null, dateB: Date | null) => {
    if (!dateA || !dateB) return false;
    return (
      dateA.getDate() === dateB.getDate() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getFullYear() === dateB.getFullYear()
    );
  };

  // Cek apakah tanggal tertentu memiliki agenda di database
  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter((event) => {
      const eventDateObj = new Date(event.eventDate);
      return isSameDay(date, eventDateObj);
    });
  };

  // Filter agenda untuk ditampilkan di panel deskripsi kanan berdasarkan tanggal terpilih
  const activeEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <main className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50">
      
      {/* HEADER UTAMA */}
      <div className="mb-12 border-b border-slate-200 pb-6 flex items-center gap-4">
        <div className="p-4 bg-red-950 text-amber-500 rounded-xl shadow-md border border-amber-500/20">
          <CalendarIcon size={32} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">
            Kalender Kegiatan Resmi
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Pantau jadwal rapat koordinasi, tahapan sosialisasi, dan agenda penting eksternal maupun internal.
          </p>
        </div>
      </div>

      {/* GRID INTERAKTIF UTAMA (12 KOLOM) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* PANEL KIRI: KALENDER INTERAKTIF (5 Kolom) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-fit">
          
          {/* Header Kalender (Bulan & Tahun) */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex space-x-1">
              <button onClick={handlePrevMonth} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <ChevronLeft size={18} />
              </button>
              <button onClick={handleNextMonth} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Label Nama Hari */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
          </div>

          {/* Grid Angka Tanggal */}
          <div className="grid grid-cols-7 gap-2 text-sm">
            {isLoading ? (
              <div className="col-span-7 text-center py-10 text-slate-400 font-medium">Memuat Kalender...</div>
            ) : (
              calendarCells.map((dateCell, index) => {
                if (!dateCell) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const hasEvents = getEventsForDate(dateCell).length > 0;
                const isSelected = isSameDay(dateCell, selectedDate);
                const isToday = isSameDay(dateCell, new Date());

                return (
                  <button
                    key={`day-${index}`}
                    onClick={() => setSelectedDate(dateCell)}
                    className={`aspect-square relative flex flex-col items-center justify-center font-bold rounded-xl transition-all duration-200 group ${
                      isSelected 
                        ? "bg-red-950 text-white shadow-lg border border-amber-500/30 scale-105" 
                        : isToday 
                        ? "bg-amber-100 text-amber-900 border border-amber-400/50" 
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{dateCell.getDate()}</span>
                    
                    {/* TANDA/MARK EMAS UNTUK TANGGAL YANG MEMILIKI AGENDA */}
                    {hasEvents && (
                      <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full transition-colors ${
                        isSelected ? "bg-amber-400" : "bg-amber-500 animate-pulse"
                      }`} />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Legenda Indikator */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Memiliki Kegiatan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300" />
              <span>Hari Ini</span>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: DESKRIPSI KEGIATAN DI SEBELAHNYA (7 Kolom) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Header Penunjuk Tanggal Terpilih */}
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-700">
              Agenda Kegiatan Tanggal:{" "}
              <span className="text-red-900 font-extrabold ml-1">
                {selectedDate?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
              {activeEvents.length} Acara
            </span>
          </div>

          {/* Daftar Detail Kegiatan */}
          {activeEvents.length === 0 ? (
            <div className="flex-1 min-h-[300px] bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Info size={40} className="text-slate-300 mb-3" />
              <p className="font-bold text-slate-700 mb-1">Tidak Ada Agenda Resmi</p>
              <p className="text-xs text-slate-400 max-w-xs">Tidak ada jadwal kegiatan atau pengumuman acara publik yang terdaftar pada tanggal ini.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {activeEvents.map((event) => (
                <div key={event.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch hover:shadow-md transition duration-300">
                  
                  {/* Gambar Poster Acara (Jika Ada) */}
                  {event.image && (
                    <div className="md:w-48 bg-slate-100 relative flex-none aspect-video md:aspect-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Konten Detail Deskripsi */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 leading-snug mb-4">
                        {event.title}
                      </h3>
                      
                      {/* Meta Waktu & Lokasi */}
                      <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mb-6 border-b border-slate-50 pb-4">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg text-slate-700">
                          <Clock size={14} className="text-amber-600" />
                          <span>{new Date(event.eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg text-slate-700">
                            <MapPin size={14} className="text-red-800" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Isi Deskripsi HTML WYSIWYG */}
                      {event.description && (
                        <div 
                          className="prose prose-sm max-w-none text-slate-600 prose-headings:text-slate-800 prose-a:text-red-800"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}