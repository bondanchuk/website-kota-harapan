'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Events() {
  const events = [
    { date: "30 MEI", time: "09:00 AM - 12:00 PM", title: "Town Cleanup Day" },
    { date: "05 JUN", time: "05:30 PM - 08:30 PM", title: "June First Friday Summer Kick-Off Party" },
    { date: "07 JUN", time: "09:00 AM - 03:00 PM", title: "Silverthorne Police Open House" },
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* BAGIAN KIRI: Komponen Kalender Besar (Porsi 5 Kolom) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col w-full">
            <h2 className="text-xl md:text-2xl font-black text-[var(--primary-color)] mb-6 md:mb-8 tracking-tight uppercase border-b-2 border-[var(--accent-gold)] pb-2 self-start">
              KALENDER KEGIATAN RESMI
            </h2>
            
            <div className="bg-slate-50 p-5 md:p-8 border border-slate-200 shadow-sm w-full rounded-sm">
              <div className="bg-[var(--primary-color)] text-white text-center py-3 md:py-4 font-bold tracking-wider text-base md:text-lg uppercase mb-6 rounded-sm">
                MEI 2026
              </div>
              
              <div className="grid grid-cols-7 gap-y-3 md:gap-y-4 gap-x-1 md:gap-x-2 text-center text-xs md:text-base font-bold">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div key={index} className="text-slate-400 font-extrabold uppercase text-[10px] md:text-xs tracking-wider mb-2">
                    {day}
                  </div>
                ))}
                
                {[...Array(31).keys()].map((day) => {
                  const dateNum = day + 1;
                  const isSpecial = dateNum === 20; 
                  return (
                    <div 
                      key={dateNum} 
                      className={`p-1 flex items-center justify-center transition-all ${
                        isSpecial 
                          ? "bg-[var(--accent-gold)] text-[var(--primary-color)] rounded-full shadow-md w-8 h-8 md:w-11 md:h-11 mx-auto" 
                          : "text-slate-700 hover:bg-slate-200/60 rounded-full cursor-pointer w-8 h-8 md:w-11 md:h-11 mx-auto"
                      }`}
                    >
                      {dateNum}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BAGIAN KANAN: Daftar 3 Baris Detail Acara + Tombol (Porsi 7 Kolom) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col space-y-4 md:space-y-6 w-full">
            <div className="h-0 lg:h-14 lg:block hidden"></div> 
            
            {events.map((event, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-100 p-4 md:p-6 shadow-sm flex items-center space-x-4 md:space-x-6 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group rounded-sm"
              >
                <div className="bg-[var(--primary-color)] text-white text-center py-2 md:py-3 px-3 md:px-5 font-black text-base md:text-lg leading-tight tracking-wide min-w-[75px] md:min-w-[95px] group-hover:bg-[var(--primary-dark)] transition-colors rounded-sm">
                  {event.date.split(" ")[0]} <br /> 
                  <span className="text-[10px] md:text-xs text-[var(--accent-gold)] tracking-widest">{event.date.split(" ")[1]}</span>
                </div>
                
                <div className="flex-1">
                  <p className="text-[10px] md:text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">{event.time}</p>
                  <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-snug group-hover:text-[var(--primary-color)] transition-colors">
                    {event.title}
                  </h3>
                </div>
                <span className="text-slate-300 text-xl md:text-2xl group-hover:text-[var(--accent-gold)] transition-colors hidden sm:block">➔</span>
              </div>
            ))}

            {/* Tombol More Events (Tepat di bawah baris ketiga list acara sebelah kanan) */}
            <div className="pt-2 flex justify-start">
              <button className="px-5 py-2.5 md:px-6 md:py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-[var(--primary-color)] hover:text-white transition-colors duration-300 rounded-sm shadow-sm">
                More Events
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}