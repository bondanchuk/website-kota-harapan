'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const locations = [
    { id: 'RSUD Kota', type: 'Rumah Sakit', lat: 0.9200, lng: 104.4500, color: '#ef4444', address: 'Jl. Ahmad Yani No. 12, Tanjung Pinang' },
    { id: 'Hotel Harmoni', type: 'Hotel', lat: 0.9150, lng: 104.4550, color: '#eab308', address: 'Jl. Hang Tuah No. 5, Tanjung Pinang' },
    { id: 'Nite & Day Hotel Laguna Bintan', type: 'Hotel', lat: 0.9288208, lng: 104.4394208, color: '#eab308', address: 'Jl. Pos No. 1, Tanjung Pinang' },
    { id: 'Hotel Aston', type: 'Hotel', lat: 0.9152638, lng: 104.5161892, color: '#eab308', address: 'Jl. Adi Sucipto KM 11, Tanjung Pinang' },
    { id: 'Pelabuhan Sri Bintan Pura', type: 'Pelabuhan', lat: 0.9250, lng: 104.4600, color: '#3b82f6', address: 'Jl. Pelabuhan, Tanjung Pinang' },
    { id: 'RSUD Provinsi', type: 'Rumah Sakit', lat: 0.9241577, lng: 104.4975143, color: '#ef4444', address: 'Jl. W.R. Supratman, Tanjung Pinang' },
];

export default function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null); // <-- DEFINISI INI YANG TADI HILANG
  const map = useRef<maplibregl.Map | null>(null);
  const activePopupRef = useRef<maplibregl.Popup | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>('Rumah Sakit');

  const categories = Array.from(new Set(locations.map(loc => loc.type)));

  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [104.4900, 0.8900],
      zoom: 13,
      pitch: 60,
      bearing: -20,
    });

    map.current.dragPan.enable();
    map.current.scrollZoom.disable();

    locations.forEach((loc) => {
      const el = document.createElement('div');
      el.style.backgroundColor = loc.color;
      el.style.width = '24px'; el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      el.style.cursor = 'pointer';

      new maplibregl.Marker({ element: el })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current!)
        .getElement().addEventListener('click', () => showPopup(loc));
    });

    return () => { map.current?.remove(); };
  }, []);

  const showPopup = (loc: typeof locations[0]) => {
    if (activePopupRef.current) activePopupRef.current.remove();
    activePopupRef.current = new maplibregl.Popup({ offset: 25 })
      .setLngLat([loc.lng, loc.lat])
      .setHTML(`
        <div style="font-family:sans-serif; padding:5px; max-width:200px;">
          <strong style="display:block; margin-bottom:4px; color:#1e293b;">${loc.id}</strong>
          <p style="margin:0; font-size:12px; color:#666;">${loc.address}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=$${loc.lat},${loc.lng}" 
             target="_blank" style="display:block; margin-top:8px; color:#3b82f6; font-weight:bold; font-size:12px; text-decoration:none;">
             Lihat di Google Maps
          </a>
        </div>
      `)
      .addTo(map.current!);
  };

  const handleItemClick = (loc: typeof locations[0]) => {
    map.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 15, essential: true });
    showPopup(loc);
  };

  return (
    <div className="w-full my-12">
      {/* JUDUL TENGAH */}
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide text-center">
          #TanjungpinangDalamPeta
        </h2>
        <div className="h-1 w-24 bg-red-800 mt-2 mx-auto"></div>
      </div>

      <section className="w-full h-[600px] flex border border-slate-200 shadow-xl rounded-md overflow-hidden">
        <div ref={mapContainer} className="flex-1 h-full" />
        
        <div className="w-80 bg-slate-900 text-white p-6 overflow-y-auto">
          <h3 className="text-sm font-bold mb-6 border-b border-slate-700 pb-4 uppercase tracking-widest text-slate-400">
              Daftar Fasilitas
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="border-b border-slate-800">
                <button 
                  onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
                  className="w-full flex justify-between items-center p-3 text-sm font-bold text-slate-300 hover:text-white"
                >
                  {cat}
                  {openCategory === cat ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {openCategory === cat && (
                  <div className="bg-slate-800/50 p-2 space-y-2">
                    {locations.filter(l => l.type === cat).map(loc => (
                      <div key={loc.id} onClick={() => handleItemClick(loc)} className="p-3 bg-slate-800 rounded-sm cursor-pointer hover:bg-slate-700 border-l-2" style={{ borderLeftColor: loc.color }}>
                        <p className="text-xs font-bold">{loc.id}</p>
                        <p className="text-[9px] text-slate-400 truncate">{loc.address}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}