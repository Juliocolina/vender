"use client";

import { useEffect, useState, useRef } from "react";

// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic';
import { getUser } from "@/lib/supabase/auth";
import { subirAvatar, obtenerPerfil, actualizarPerfil } from "@/lib/supabase/perfil";
import { User } from "@supabase/supabase-js";
import { MiTienda } from "@/components/tienda/MiTienda";
import { MisProductos } from "@/components/productos/MisProductos";
import { MisCampanas } from "@/components/campanas/MisCampanas";
import { StickyBannerFooter } from "@/components/campanas/StickyBannerFooter";

import { obtenerMiTienda, Store } from "@/lib/supabase/tienda";

type View = "feed" | "mi-tienda" | "productos" | "campanas";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>("feed");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState<string>("Nombre Apellido");
  const [tienda, setTienda] = useState<Store | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUser();
      setUser(currentUser);
      
      if (currentUser?.id) {
        const perfil = await obtenerPerfil(currentUser.id, currentUser.email);
        if (perfil) {
          setNombreUsuario(perfil.nombre || currentUser.user_metadata?.full_name || "Nombre Apellido");
          if (perfil.avatar_url) {
            setFotoPerfil(perfil.avatar_url);
          }
        }
        
        // Cargar tienda del usuario
        const tiendaData = await obtenerMiTienda(currentUser.id);
        if (tiendaData) {
          setTienda(tiendaData);
        }
      }
    };
    fetchUser();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setSubiendoFoto(true);
    
    try {
      // Subir a Storage
      const avatarUrl = await subirAvatar(file, user.id);
      
      if (avatarUrl) {
        // Guardar referencia en perfil
        await actualizarPerfil(user.id, { avatar_url: avatarUrl });
        setFotoPerfil(avatarUrl);
      } else {
        // Fallback: preview local
        const reader = new FileReader();
        reader.onload = (event) => {
          setFotoPerfil(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error subiendo foto:', error);
      // Fallback: preview local
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoPerfil(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    setSubiendoFoto(false);
  };

  // Mostrar vista Mi Tienda
  if (activeView === "mi-tienda") {
    return <MiTienda onBack={() => setActiveView("feed")} />;
  }

  // Mostrar vista Productos
  if (activeView === "productos") {
    return <MisProductos onBack={() => setActiveView("feed")} />;
  }

  // Mostrar vista Campañas
  if (activeView === "campanas") {
    return <MisCampanas onBack={() => setActiveView("feed")} />;
  }

  return (
    <main className="flex-1 overflow-y-auto flex flex-col pb-24">
        {/* Sección de perfil */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-4">
          <label className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg relative cursor-pointer group overflow-hidden">
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {subiendoFoto ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-white text-lg">📷</span>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSubirFoto}
              disabled={subiendoFoto}
            />
          </label>
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-black">{nombreUsuario}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 font-medium text-xs">{user?.email || 'usuario@email.com'}</p>
            </div>
          </div>
        </section>

        {/* Contenido (Descripción, Métricas y Feed) */}
        <section className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <p className="text-gray-700 text-sm max-w-lg">
              {tienda?.description || "Configura la descripción de tu tienda en Mi Tienda"}
            </p>
            <div className="flex justify-center gap-3 sm:gap-4 mt-3 flex-wrap">
              {tienda?.whatsapp && (
                <a
                  href={tienda.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <img src="/whatsapp.svg" alt="WhatsApp" className="h-4 w-4" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              )}
              {tienda?.instagram && (
                <a
                  href={tienda.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#E1306C' }}
                >
                  <img src="/instagram.svg" alt="Instagram" className="h-4 w-4" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              )}
              {tienda?.tiktok && (
                <a
                  href={tienda.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#000000' }}
                >
                  <img src="/tiktok.svg" alt="TikTok" className="h-4 w-4" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              )}
              {tienda?.facebook && (
                <a
                  href={tienda.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#1877F2' }}
                >
                  <img src="/facebook.svg" alt="Facebook" className="h-4 w-4" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              )}
              {!tienda?.whatsapp && !tienda?.instagram && !tienda?.tiktok && !tienda?.facebook && (
                <p className="text-xs text-gray-500">Agrega tus redes en Mi Tienda</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[{t:'Tiendas',v:'1.2K'},{t:'Seguidores',v:'5.4K'},{t:'Campañas',v:'15K'}].map(m => (
              <div key={m.t} className="flex flex-col items-center text-center">
                <h4 className="font-black text-sm sm:text-base mb-0.5">{m.v}</h4>
                <p className="text-[10px] sm:text-xs text-gray-600 uppercase font-bold">{m.t}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 sm:gap-8 border-b border-gray-200 pb-2">
            <button 
              onClick={() => setActiveView("mi-tienda")}
              className="pb-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-[#0a1a2f] transition-colors flex items-center gap-1.5"
            >
              <span>🏠</span>
              <span>Tiendas</span>
            </button>
            <button 
              onClick={() => setActiveView("productos")}
              className="pb-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-[#0a1a2f] transition-colors flex items-center gap-1.5"
            >
              <span>📦</span>
              <span>Productos</span>
            </button>
            <button 
              onClick={() => setActiveView("campanas")}
              className="pb-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-[#0a1a2f] transition-colors flex items-center gap-1.5"
            >
              <span>📢</span>
              <span>Campañas</span>
            </button>
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

        {/* STICKY BANNER FOOTER - Dinámico con campañas activas */}
        <StickyBannerFooter />
      </main>
  );
}