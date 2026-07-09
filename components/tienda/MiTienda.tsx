"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/supabase/auth";
import { obtenerMiTienda, actualizarTienda, subirLogoTienda, Store } from "@/lib/supabase/tienda";
import { obtenerCategorias } from "@/lib/supabase/productos";

type Tab = "general" | "banners" | "redes" | "categorias" | "productos";

// Tipos correctos según el esquema SQL
interface Categoria {
  id: string; // uuid
  name: string;
  slug: string;
  productos_count?: number;
}

interface Banner {
  id: string; // uuid
  image_url: string;
  position: number;
  is_active: boolean;
}

interface Producto {
  id: string; // uuid
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null; // uuid
  image_url: string | null;
}

export function MiTienda({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(true);
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
            {activeTab === "banners" && <BannersTab storeId={storeId} />}
            {activeTab === "redes" && <RedesTab store={store} setStore={setStore} storeId={storeId} />}
            {activeTab === "categorias" && <CategoriasTab categorias={categorias} setCategorias={setCategorias} storeId={storeId} />}
            {activeTab === "productos" && <ProductosTab categorias={categorias} storeId={storeId} />}
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

function BannersTab({ storeId }: { storeId: string | null }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  
  // TODO: Cargar banners desde la base de datos
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Banners Promocionales</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{banners.length}/3</span>
        </div>
      </div>

      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <span className="text-4xl mb-2 block">🖼️</span>
        <p className="text-gray-500 font-medium">Próximamente: Gestión de banners</p>
        <p className="text-sm text-gray-400 mt-1">Agrega hasta 3 banners para promocionar tus ofertas</p>
      </div>
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
    },
    { 
      key: "instagram" as const, 
      label: "Instagram", 
      color: "#E1306C",
      placeholder: "https://instagram.com/tu_usuario",
    },
    { 
      key: "tiktok" as const, 
      label: "TikTok", 
      color: "#000000",
      placeholder: "https://tiktok.com/@tu_usuario",
    },
    { 
      key: "facebook" as const, 
      label: "Facebook", 
      color: "#1877F2",
      placeholder: "https://facebook.com/tu_pagina",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-vender-blue">Redes Sociales</h2>

      <div className="grid gap-4">
        {redes.map((red) => (
          <div key={red.key} className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: red.color }}
            >
              <span className="text-lg">{red.label[0]}</span>
            </div>
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

function CategoriasTab({ categorias, setCategorias, storeId }: { 
  categorias: Categoria[]; 
  setCategorias: (c: Categoria[]) => void;
  storeId: string | null;
}) {
  // TODO: Integrar con base de datos
  // Por ahora solo muestra las categorías cargadas
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Categorías</h2>
        <button 
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
                  <p className="font-bold text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.productos_count || 0} productos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductosTab({ categorias, storeId }: { 
  categorias: Categoria[];
  storeId: string | null;
}) {
  // TODO: Cargar productos desde la base de datos
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Productos</h2>
        <button 
          className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2 px-4 rounded-xl text-sm transition-colors"
        >
          + Nuevo
        </button>
      </div>

      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <span className="text-4xl mb-2 block">📦</span>
        <p className="text-gray-500 font-medium">Gestiona tus productos</p>
        <p className="text-sm text-gray-400 mt-1">Usa la sección de Productos en el menú principal</p>
      </div>
    </div>
  );
}
