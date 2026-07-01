"use client";

import { useRef } from "react";

export default function DashboardPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* 🛍️ Menú lateral izquierdo */}
      <aside className="w-56 lg:w-64 bg-white border-r border-gray-200 p-4 sm:p-6 hidden md:block">
        <h2 className="font-black text-xl lg:text-2xl mb-6 lg:mb-8 text-[#0a1a2f]">VENDER</h2>
        <nav className="space-y-3 lg:space-y-4">
          <a href="#" className="block p-2.5 lg:p-3 rounded-xl bg-[#d4af37] text-[#0a1a2f] font-bold text-sm lg:text-base">Inicio (Feed)</a>
          <a href="#" className="block p-2.5 lg:p-3 text-gray-700 hover:bg-gray-100 rounded-xl text-sm lg:text-base">Explorar</a>
          <a href="#" className="block p-2.5 lg:p-3 text-gray-700 hover:bg-gray-100 rounded-xl text-sm lg:text-base">Mensajes</a>
        </nav>
      </aside>

      {/* Contenedor Principal */}
      <main className="flex-1 overflow-y-auto flex flex-col pb-24">
        {/* Banner de Portada */}
        <div className="grid grid-cols-2 gap-4 px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-gray-300 to-gray-400 w-full relative rounded-xl">
            <button className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 text-white p-1.5 sm:p-2 rounded-full text-xs">📷 Editar Portada</button>
          </div>
          <div className="h-32 sm:h-40 bg-gradient-to-r from-gray-300 to-gray-400 w-full relative rounded-xl">
            <button className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 text-white p-1.5 sm:p-2 rounded-full text-xs">📷 Editar Portada</button>
          </div>
        </div>

        {/* Sección alineada */}
        <section className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg relative">
               <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full border text-xs sm:text-sm">📷</button>
            </div>
            <h2 className="text-base sm:text-lg font-black mt-2 text-center">Nombre Apellido</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-700 font-medium text-xs">usuario@email.com</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl lg:max-w-3xl relative flex items-center group">
            <button onClick={() => scroll('left')} className="absolute -left-8 sm:-left-10 z-20 bg-white p-1.5 sm:p-2 rounded-full shadow-lg border hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 text-sm sm:text-base">&lt;</button>
            <div ref={scrollRef} className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-2 w-full px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
              <label className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#d4af37] flex flex-col items-center justify-center cursor-pointer flex-shrink-0 hover:bg-yellow-50 transition-colors">
                <span className="text-lg sm:text-xl text-[#d4af37]">+</span>
                <span className="text-[7px] sm:text-[8px] font-bold text-[#d4af37]">SUBIR</span>
                <input type="file" className="hidden" />
              </label>
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-gray-300 p-0.5 flex-shrink-0 bg-white hover:border-gray-400 transition-colors">
                  <div className="w-full h-full rounded-full bg-gray-200"></div>
                </div>
              ))}
            </div>
            <button onClick={() => scroll('right')} className="absolute -right-8 sm:-right-10 z-20 bg-white p-1.5 sm:p-2 rounded-full shadow-lg border hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 text-sm sm:text-base">&gt;</button>
          </div>
        </section>

        {/* Contenedor de Puntos de Navegación */}
        <div className="flex justify-center gap-1.5 pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
          ))}
        </div>

        {/* Contenido (Descripción, Métricas y Feed) */}
        <section className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <p className="text-gray-700 text-sm max-w-lg">Red de Crecimiento Digital comercial y marketing digital. Impulsamos tu marca al siguiente nivel.</p>
            <div className="flex justify-center gap-3 sm:gap-4 mt-3 flex-wrap">
              {[
                { name: 'WhatsApp', icon: '/whatsapp.svg', color: '#25D366' },
                { name: 'TikTok', icon: '/tiktok.svg', color: '#000000' },
                { name: 'Instagram', icon: '/instagram.svg', color: '#E1306C' },
                { name: 'Facebook', icon: '/facebook.svg', color: '#1877F2' }
              ].map((platform) => (
                <a 
                  key={platform.name} 
                  href="#" 
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: platform.color }}
                >
                  <img src={platform.icon} alt={platform.name} className="h-4 w-4" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[{t:'Tiendas',v:'1.2K'},{t:'Seguidores',v:'5.4K'},{t:'Campañas',v:'15K'}].map(m => (
              <div key={m.t} className="flex flex-col items-center text-center">
                <h4 className="font-black text-sm sm:text-base mb-0.5">{m.v}</h4>
                <p className="text-[7px] sm:text-[9px] text-gray-600 uppercase font-bold">{m.t}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 sm:gap-8 border-b border-gray-200 pb-2">
            {['🏠 Tiendas', '📦 Productos', '📢 Campañas'].map(t => (
              <button key={t} className="pb-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-[#0a1a2f] transition-colors">{t}</button>
            ))}
          </div>

          {/* Feed de Tarjetas optimizado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
            {[
              { type: 'Tienda', title: 'EcoModa Store', metric: '12K', icon: 'eye' },
              { type: 'Producto', title: 'Smartwatch Pro', metric: '4.5K', icon: 'heart' },
              { type: 'Publicidad', title: 'Sigue esta cuenta', metric: 'TikTok', icon: 'tiktok', color: '#000000' },
              { type: 'Tienda', title: 'Tech Valley', metric: '8.2K', icon: 'eye' },
              { type: 'Producto', title: 'Audífonos BT', metric: '2.1K', icon: 'heart' },
              { type: 'Publicidad', title: 'Curso de Chef', metric: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
              { type: 'Tienda', title: 'Home Style', metric: '5.9K', icon: 'eye' },
              { type: 'Producto', title: 'Silla Gamer', metric: '3.4K', icon: 'heart' },
              { type: 'Tienda', title: 'Urban Wear', metric: '7.1K', icon: 'eye' },
              { type: 'Producto', title: 'Teclado Mecánico', metric: '1.9K', icon: 'heart' },
              { type: 'Publicidad', title: 'Like a mi foto', metric: 'Instagram', icon: 'instagram', color: '#E1306C' },
              { type: 'Publicidad', title: 'Descuento 50%', metric: 'Facebook', icon: 'none', color: '#1877F2' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl sm:rounded-3xl shadow-sm border p-4 sm:p-5 hover:shadow-lg transition-all duration-200 ${item.color ? 'border-opacity-20' : 'border-gray-200 bg-white'}`} style={{ borderColor: item.color ? item.color : '#e5e7eb' }}>
                <div className="h-32 sm:h-40 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex items-center justify-center font-black text-xs uppercase tracking-wider" style={{ backgroundColor: item.color ? `${item.color}20` : '#f3f4f6', color: item.color ? item.color : '#4b5563' }}>
                  {item.type}
                </div>
                <p className="font-black text-sm text-gray-800 px-1 truncate">{item.title}</p>
                    <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-600">
                      {item.metric}
                    </span>
                    {item.icon === 'eye' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                    {item.icon === 'heart' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    {item.icon === 'tiktok' && (
                      <img src="/tiktok.svg" alt="TikTok" className="h-3.5 w-3.5" />
                    )}
                    {item.icon === 'whatsapp' && (
                      <img src="/whatsapp.svg" alt="WhatsApp" className="h-3.5 w-3.5" />
                    )}
                    {item.icon === 'instagram' && (
                      <img src="/instagram.svg" alt="Instagram" className="h-3.5 w-3.5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STICKY BANNER FOOTER - Fijo para conversiones */}
        <div className="fixed bottom-0 left-0 md:left-56 lg:left-64 right-0 bg-[#1e293b] p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-50 flex items-center justify-between border-t border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold text-white text-[10px]">V</div>
            <div>
              <h3 className="text-white font-black text-xs md:text-sm">STIKY BANER FOOTER</h3>
              <p className="text-gray-400 text-[9px] md:text-[10px]">Cleano, largo, capacidad de servicios</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-[#25D366] text-white px-3 py-1.5 rounded-full text-[10px] font-bold">WhatsApp</button>
            <button className="bg-white text-[#1e293b] px-3 py-1.5 rounded-full text-[10px] font-bold">Web</button>
            <button className="bg-[#d4af37] text-white px-3 py-1.5 rounded-full text-[10px] font-bold">Llamar</button>
          </div>
        </div>
      </main>
    </div>
  );
}