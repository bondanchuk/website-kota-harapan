export default function CalendarSection() {
  return (
    <section className="bg-white py-16 border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-6">
        <h2 className="text-xl font-black text-[var(--primary-color)] mb-8 tracking-tight uppercase border-b-2 border-[var(--accent-gold)] pb-2 inline-block">
          KALENDER KEGIATAN RESMI
        </h2>
        
        <div className="bg-slate-50 p-6 md:p-10 border border-slate-200 shadow-xs rounded-sm max-w-4xl mx-auto">
          <div className="bg-[var(--primary-color)] text-white text-center py-4 font-bold tracking-wider text-xl uppercase mb-8 rounded-sm">
            MEI 2026
          </div>
          <div className="grid grid-cols-7 gap-y-4 md:gap-y-6 gap-x-2 md:gap-4 text-center text-sm md:text-lg font-bold">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <div key={idx} className="text-slate-400 font-extrabold uppercase text-xs tracking-wider mb-2">{day}</div>
            ))}
            {[...Array(31).keys()].map((day) => {
              const dateNum = day + 1;
              const isSpecial = dateNum === 20; 
              return (
                <div 
                  key={dateNum} 
                  className={`p-2 flex items-center justify-center transition-all ${
                    isSpecial 
                      ? "bg-[var(--accent-gold)] text-[var(--primary-color)] rounded-full shadow-md w-10 h-10 md:w-14 md:h-14 mx-auto" 
                      : "text-slate-700 hover:bg-slate-200/60 rounded-full cursor-pointer w-10 h-10 md:w-14 md:h-14 mx-auto"
                  }`}
                >
                  {dateNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}