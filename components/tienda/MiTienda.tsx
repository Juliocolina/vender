"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/supabase/auth";
import { obtenerMiTienda, actualizarTienda, subirLogoTienda, Store } from "@/lib/supabase/tienda";
import { obtenerCategorias } from "@/lib/supabase/productos";

type Tab = "general" | "banners" | "redes" | "categorias" | "productos";

interface Categoria {
  id: string;
  name: string;
  slug: string;
  productos_count?: number;
}

export function MiTienda({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [store, setStore] = useState<Partial<Store>>({
    name: "",
    description: "",
    logo_url: "",
    whatsapp: "",
    tiktok: "",
    instagram: "",
    facebook: "",
    website: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    const user = await getUser();
    
    if (user) {
      const tienda = await obtenerMiTienda(user.id);
      if (tienda) {
        setStoreId(tienda.id);
        setStore(tienda);
        
        const cats = await obtenerCategorias(tienda.id);
        setCategorias(cats);
      }
    }
    setLoading(false);
  };

  const tabs = [
    { id: "general" as Tab, label: "Información", icon: "📋" },
    { id: "banners" as Tab, label: "Banners", icon: "🖼️" },
    { id: "redes" as Tab, label: "Redes", icon: "🔗" },
    { id: "categorias" as Tab, label: "Categorías", icon: "🏷️" },
    { id: "productos" as Tab, label: "Productos", icon: "📦" },
  ];

  return (
    <div className="flex-1 overflow-y-auto flex flex-col pb-24">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header con botón volver */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            aria-label="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-black text-vender-blue">Mi Tienda</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 pt-1 px-1 -mx-1" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ease-in-out ${
                activeTab === tab.id
                  ? "bg-white text-vender-blue border-b-2 border-vender-blue/30"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={
                activeTab === tab.id
                  ? { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }
                  : {}
              }
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-vender-blue rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {activeTab === "general" && (
              <GeneralTab
                store={store}
                setStore={setStore}
                storeId={storeId}
                onSave={cargarDatos}
              />
            )}
            {activeTab === "banners" && <BannersTab />}
            {activeTab === "redes" && <RedesTab store={store} setStore={setStore} storeId={storeId} />}
            {activeTab === "categorias" && <CategoriasTab categorias={categorias} setCategorias={setCategorias} />}
            {activeTab === "productos" && <ProductosTab categorias={categorias} />}
          </div>
        )}
      </div>
    </div>
  );
}

function GeneralTab({ store, setStore, storeId, onSave }: { 
  store: Partial<Store>; 
  setStore: (s: Partial<Store>) => void;
  storeId: string | null;
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [subiendoLogo, setSubiendoLogo] = useState(false);

  const handleSubirLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    setSubiendoLogo(true);
    
    try {
      const logoUrl = await subirLogoTienda(file, storeId);
      
      if (logoUrl) {
        const exito = await actualizarTienda(storeId, { logo_url: logoUrl });
        if (exito) {
          setStore({ ...store, logo_url: logoUrl });
          alert('Logo actualizado exitosamente');
        }
      } else {
        alert('Error al subir el logo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir el logo');
    } finally {
      setSubiendoLogo(false);
    }
  };

  const handleSave = async () => {
    if (!storeId) return;
    setSaving(true);
    const exito = await actualizarTienda(storeId, {
      name: store.name,
      description: store.description,
      website: store.website,
    });
    setSaving(false);
    
    if (exito) {
      alert('Cambios guardados exitosamente');
      onSave();
    } else {
      alert('Error al guardar');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-vender-blue">Información General</h2>
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
          {store.logo_url ? (
            <img src={store.logo_url} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-gray-400">🏪</span>
          )}
        </div>
        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors">
          {subiendoLogo ? 'Subiendo...' : 'Subir Logo'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleSubirLogo}
            disabled={subiendoLogo}
          />
        </label>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre de la tienda *</label>
          <input
            type="text"
            value={store.name || ""}
            onChange={(e) => setStore({ ...store, name: e.target.value })}
            placeholder="Mi Tienda Increíble"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
          <textarea
            value={store.description || ""}
            onChange={(e) => setStore({ ...store, description: e.target.value })}
            placeholder="Describe tu tienda..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Sitio Web</label>
          <input
            type="url"
            value={store.website || ""}
            onChange={(e) => setStore({ ...store, website: e.target.value })}
            placeholder="https://mitienda.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-vender-blue border-t-transparent rounded-full animate-spin" />
            Guardando...
          </>
        ) : 'Guardar Cambios'}
      </button>
    </div>
  );
}

function BannersTab() {
  const [banners, setBanners] = useState<Array<{
    id: number;
    image_url: string;
    title: string;
    description: string;
    category: string;
    is_active: boolean;
  }>>([]);
  
  const [editingBanner, setEditingBanner] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const handleImageUpload = (bannerId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanners(banners.map(b => 
          b.id === bannerId ? { ...b, image_url: reader.result as string } : b
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const addBanner = () => {
    if (banners.length < 3) {
      const newBanner = {
        id: Date.now(),
        image_url: '',
        title: '',
        description: '',
        category: '',
        is_active: true,
      };
      setBanners([...banners, newBanner]);
    }
  };

  const removeBanner = (id: number) => {
    setBanners(banners.filter(b => b.id !== id));
    if (editingBanner === id) setEditingBanner(null);
  };

  const saveBanner = (id: number) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, ...formData } : b
    ));
    setEditingBanner(null);
    setFormData({ title: '', description: '', category: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Banners Promocionales</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{banners.length}/3</span>
          {banners.length < 3 && (
            <button 
              onClick={addBanner}
              className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2 px-4 rounded-xl text-sm transition-colors"
            >
              + Nuevo
            </button>
          )}
        </div>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-2 block">🖼️</span>
          <p className="text-gray-500 font-medium">No tienes banners activos</p>
          <p className="text-sm text-gray-400 mt-1">Agrega hasta 3 banners para promocionar tus ofertas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="space-y-3">
              {/* Banner Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 group">
                {banner.image_url ? (
                  <>
                    <img 
                      src={banner.image_url} 
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="cursor-pointer bg-white text-vender-blue px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100">
                        Cambiar
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={(e) => handleImageUpload(banner.id, e)}
                        />
                      </label>
                      <button 
                        onClick={() => removeBanner(banner.id)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                    {banner.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white font-bold text-sm">{banner.title}</p>
                        {banner.description && (
                          <p className="text-gray-200 text-xs mt-1">{banner.description}</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:border-vender-gold hover:bg-vender-gold/5 transition-all">
                    <span className="text-3xl text-gray-400 mb-1">➕</span>
                    <span className="text-sm font-medium text-gray-500">Subir imagen</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => handleImageUpload(banner.id, e)}
                    />
                  </label>
                )}
              </div>

              {/* Banner Form */}
              {editingBanner === banner.id ? (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Título de la oferta"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vender-gold focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Descripción (ej: 50% desc en relojes)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vender-gold focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Categoría (ej: Accesorios)"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-vender-gold focus:outline-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveBanner(banner.id)}
                      className="flex-1 bg-vender-gold text-vender-blue font-medium py-2 rounded-lg text-sm hover:bg-[#b8962e] transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingBanner(null);
                        setFormData({ title: '', description: '', category: '' });
                      }}
                      className="px-4 bg-gray-200 text-gray-600 font-medium py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingBanner(banner.id);
                    setFormData({
                      title: banner.title,
                      description: banner.description,
                      category: banner.category,
                    });
                  }}
                  className="w-full text-left bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {banner.title ? (
                        <>
                          <p className="font-medium text-sm text-gray-800">{banner.title}</p>
                          <p className="text-xs text-gray-500">{banner.category || 'Sin categoría'}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">Editar información del banner</p>
                      )}
                    </div>
                    <span className="text-gray-400">✏️</span>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RedesTab({ store, setStore, storeId }: { store: Partial<Store>; setStore: (s: Partial<Store>) => void; storeId: string | null }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!storeId) return;
    setSaving(true);
    const exito = await actualizarTienda(storeId, {
      whatsapp: store.whatsapp,
      tiktok: store.tiktok,
      instagram: store.instagram,
      facebook: store.facebook,
    });
    setSaving(false);
    
    if (exito) {
      alert('Redes sociales guardadas exitosamente');
    } else {
      alert('Error al guardar');
    }
  };
  const redes = [
    { 
      key: "whatsapp" as const, 
      label: "WhatsApp", 
      color: "#25D366",
      placeholder: "https://wa.me/584141234567",
      svg: <svg role="img" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    },
    { 
      key: "instagram" as const, 
      label: "Instagram", 
      color: "#E1306C",
      placeholder: "https://instagram.com/tu_usuario",
      svg: <svg role="img" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
    },
    { 
      key: "tiktok" as const, 
      label: "TikTok", 
      color: "#000000",
      placeholder: "https://tiktok.com/@tu_usuario",
      svg: <svg role="img" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
    },
    { 
      key: "facebook" as const, 
      label: "Facebook", 
      color: "#1877F2",
      placeholder: "https://facebook.com/tu_pagina",
      svg: <svg role="img" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-vender-blue">Redes Sociales</h2>

      <div className="grid gap-4">
        {redes.map((red) => (
          <div key={red.key} className="flex items-center gap-4">
            <a
              href={store[red.key] || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all ${
                store[red.key] ? 'hover:scale-110 cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: red.color }}
              onClick={(e) => !store[red.key] && e.preventDefault()}
            >
              {red.svg}
            </a>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">{red.label}</label>
              <input
                type="url"
                value={store[red.key] || ""}
                onChange={(e) => setStore({ ...store, [red.key]: e.target.value })}
                placeholder={red.placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-vender-blue border-t-transparent rounded-full animate-spin" />
            Guardando...
          </>
        ) : 'Guardar Cambios'}
      </button>
    </div>
  );
}

function CategoriasTab({ categorias, setCategorias }: { categorias: Categoria[]; setCategorias: (c: Categoria[]) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: '', slug: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ nombre: '', slug: '' });
    setModalOpen(true);
  };

  const openEditModal = (cat: typeof categorias[0]) => {
    setEditingId(cat.id);
    setFormData({ nombre: cat.nombre, slug: cat.slug });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre.trim()) return;
    
    const slug = formData.slug || formData.nombre.toLowerCase().replace(/\s+/g, '-');
    
    if (editingId) {
      setCategorias(categorias.map(c => 
        c.id === editingId ? { ...c, nombre: formData.nombre, slug } : c
      ));
    } else {
      setCategorias([...categorias, {
        id: Date.now(),
        nombre: formData.nombre,
        slug,
        productos: 0
      }]);
    }
    
    setModalOpen(false);
    setFormData({ nombre: '', slug: '' });
  };

  const handleDelete = (id: number) => {
    setCategorias(categorias.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Categorías</h2>
        <button 
          onClick={openNewModal}
          className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2 px-4 rounded-xl text-sm transition-colors"
        >
          + Nueva
        </button>
      </div>

      {categorias.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-2 block">🏷️</span>
          <p className="text-gray-500 font-medium">No tienes categorías creadas</p>
          <p className="text-sm text-gray-400 mt-1">Crea categorías para organizar tus productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categorias.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏷️</span>
                <div>
                  <p className="font-bold text-gray-800">{cat.nombre}</p>
                  <p className="text-xs text-gray-500">{cat.productos} productos</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(cat)}
                  className="p-2 text-gray-500 hover:text-vender-blue transition-colors"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => setDeleteConfirm(cat.id)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-vender-blue">
              {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Accesorios"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Slug (opcional)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Ej: accesorios"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Se genera automáticamente si lo dejas vacío</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 rounded-xl transition-colors"
              >
                {editingId ? 'Guardar' : 'Crear'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="text-center">
              <span className="text-4xl block mb-2">⚠️</span>
              <h3 className="text-lg font-bold text-gray-800">¿Eliminar categoría?</h3>
              <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductosTab({ categorias }: { categorias: Categoria[] }) {
  const [productos, setProductos] = useState<Array<{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria_id: number | null;
    imagen: string;
  }>>([
    { id: 1, nombre: "Camiseta Pro", descripcion: "Camiseta de algodón premium", precio: 29.99, stock: 15, categoria_id: 1, imagen: "" },
    { id: 2, nombre: "Gorra Urban", descripcion: "Gorra ajustable", precio: 19.99, stock: 8, categoria_id: 2, imagen: "" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria_id: '',
  });

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '' });
    setModalOpen(true);
  };

  const openEditModal = (prod: typeof productos[0]) => {
    setEditingId(prod.id);
    setFormData({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio.toString(),
      stock: prod.stock.toString(),
      categoria_id: prod.categoria_id ? prod.categoria_id.toString() : '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre.trim() || !formData.precio) return;
    
    const categoriaId = formData.categoria_id ? parseInt(formData.categoria_id) : null;
    
    if (editingId) {
      setProductos(productos.map(p => 
        p.id === editingId ? {
          ...p,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock) || 0,
          categoria_id: categoriaId,
        } : p
      ));
    } else {
      setProductos([...productos, {
        id: Date.now(),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        categoria_id: categoriaId,
        imagen: '',
      }]);
    }
    
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setProductos(productos.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Productos</h2>
        <button 
          onClick={openNewModal}
          className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2 px-4 rounded-xl text-sm transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-2 block">📦</span>
          <p className="text-gray-500 font-medium">No tienes productos creados</p>
          <p className="text-sm text-gray-400 mt-1">Agrega tu primer producto para empezar a vender</p>
        </div>
      ) : (
        <>
          {/* Desktop: Tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Producto</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Precio</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Categoría</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-800">{prod.nombre}</td>
                    <td className="py-3 px-4 text-gray-600">${prod.precio.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        prod.stock > 5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {prod.stock} uds
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{categorias.find(c => c.id === prod.categoria_id)?.nombre || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => openEditModal(prod)}
                        className="p-2 text-gray-500 hover:text-vender-blue transition-colors"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(prod.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {productos.map((prod) => (
              <div key={prod.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{prod.nombre}</p>
                    <p className="text-sm text-gray-500 mt-1">{categorias.find(c => c.id === prod.categoria_id)?.nombre || 'Sin categoría'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    prod.stock > 5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {prod.stock} uds
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-vender-blue">${prod.precio.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(prod)}
                      className="p-2 text-gray-500 hover:text-vender-blue transition-colors"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(prod.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Crear/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 my-8">
            <h3 className="text-lg font-bold text-vender-blue">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Camiseta Pro"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el producto..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoría</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 rounded-xl transition-colors"
              >
                {editingId ? 'Guardar' : 'Crear'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="text-center">
              <span className="text-4xl block mb-2">⚠️</span>
              <h3 className="text-lg font-bold text-gray-800">¿Eliminar producto?</h3>
              <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
