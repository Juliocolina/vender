"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/supabase/auth";
import { obtenerMiTienda, actualizarTienda, subirLogoTienda, Store } from "@/lib/supabase/tienda";
import { obtenerCategorias, crearCategoria, crearProducto, subirImagenProducto, obtenerProductos, Categoria as CategoriaDB, Producto as ProductoDB } from "@/lib/supabase/productos";
import { obtenerBanners, crearBanner, subirImagenBanner, eliminarBanner, Banner as BannerDB } from "@/lib/supabase/banners";

type Tab = "general" | "banners" | "redes" | "categorias" | "productos";

// Usar tipos de la base de datos
type Categoria = CategoriaDB;
type Producto = ProductoDB;
type Banner = BannerDB;

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
            {activeTab === "banners" && <BannersTab storeId={storeId} categorias={categorias} />}
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

function BannersTab({ storeId, categorias }: { storeId: string | null; categorias: Categoria[] }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    if (storeId) {
      cargarBanners();
    }
  }, [storeId]);

  const cargarBanners = async () => {
    if (!storeId) return;
    const bannersData = await obtenerBanners(storeId);
    setBanners(bannersData);
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagenFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagenPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const abrirPreview = () => {
    if (!imagenPreview) {
      alert('Selecciona una imagen primero');
      return;
    }
    setMostrarPreview(true);
  };

  const confirmarBanner = async () => {
    if (!storeId || !imagenFile) return;

    setCreando(true);
    setSubiendo(true);

    const imagenUrl = await subirImagenBanner(imagenFile, storeId);
    setSubiendo(false);

    if (!imagenUrl) {
      alert('Error al subir la imagen');
      setCreando(false);
      return;
    }

    const nuevoBanner = await crearBanner(storeId, {
      image_url: imagenUrl,
      category_id: categoriaSeleccionada || undefined,
    });

    if (nuevoBanner) {
      setBanners([nuevoBanner, ...banners]);
      setMostrarFormulario(false);
      setMostrarPreview(false);
      setImagenFile(null);
      setImagenPreview('');
      setCategoriaSeleccionada('');
    } else {
      alert('Error al crear el banner');
    }
    setCreando(false);
  };

  const handleEliminarBanner = async (bannerId: string) => {
    if (!confirm('¿Eliminar este banner?')) return;

    const exito = await eliminarBanner(bannerId);
    if (exito) {
      setBanners(banners.filter(b => b.id !== bannerId));
    } else {
      alert('Error al eliminar el banner');
    }
  };

  const categoriaNombre = (id: string) => {
    const cat = categorias.find(c => c.id === id);
    return cat?.name || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Banners Promocionales</h2>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2 px-4 rounded-xl text-sm transition-colors"
        >
          + Crear Banner
        </button>
      </div>

      {/* Formulario de creación */}
      {mostrarFormulario && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-gray-800">Nuevo Banner</h3>

          {/* Subir imagen */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen del Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
            />
            {imagenPreview && (
              <div className="mt-3 rounded-xl overflow-hidden bg-gray-200 h-40">
                <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Selector de categoría */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Categoría (opcional)</label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
            >
              <option value="">Sin categoría (solo imagen)</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {categoriaSeleccionada && (
              <p className="text-xs text-gray-500 mt-1">
                Al hacer click, el cliente irá a: {categoriaNombre(categoriaSeleccionada)}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <button
              onClick={abrirPreview}
              disabled={!imagenPreview}
              className="flex-1 bg-white border-2 border-vender-gold text-vender-blue font-bold py-3 rounded-xl hover:bg-vender-gold/10 transition-colors disabled:opacity-50"
            >
              👁️ Vista Previa
            </button>
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setImagenFile(null);
                setImagenPreview('');
                setCategoriaSeleccionada('');
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de preview */}
      {mostrarPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-vender-blue">Vista Previa del Banner</h3>
            </div>

            {/* Banner preview */}
            <div className="aspect-video bg-gray-100 relative">
              <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
              {categoriaSeleccionada && (
                <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-bold">
                  🏷️ {categoriaNombre(categoriaSeleccionada)}
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600">
                {categoriaSeleccionada
                  ? 'Este banner redirigirá a la categoría seleccionada.'
                  : 'Este banner mostrará solo la imagen.'}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={confirmarBanner}
                  disabled={subiendo || creando}
                  className="flex-1 bg-vender-gold text-vender-blue font-bold py-3 rounded-xl hover:bg-[#b8962e] transition-colors disabled:opacity-50"
                >
                  {subiendo ? 'Subiendo...' : creando ? 'Creando...' : '✓ Publicar Banner'}
                </button>
                <button
                  onClick={() => setMostrarPreview(false)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                  disabled={subiendo || creando}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de banners existentes */}
      {banners.length === 0 && !mostrarFormulario && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-2 block">🖼️</span>
          <p className="text-gray-500 font-medium">No tienes banners creados</p>
          <p className="text-sm text-gray-400 mt-1">Crea banners para promocionar tus ofertas</p>
        </div>
      )}

      {banners.length > 0 && (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video group">
              <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
              {banner.category_id && (
                <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-bold">
                  🏷️ {categoriaNombre(banner.category_id)}
                </div>
              )}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEliminarBanner(banner.id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  🗑️
                </button>
              </div>
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
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [creando, setCreando] = useState(false);
  
  const crearNuevaCategoria = async () => {
    if (!storeId || !nombreCategoria.trim()) return;
    
    setCreando(true);
    const nuevaCategoria = await crearCategoria(storeId, nombreCategoria);
    
    if (nuevaCategoria) {
      setCategorias([...categorias, { ...nuevaCategoria, productos_count: 0 }]);
      setNombreCategoria('');
      setMostrarFormulario(false);
    } else {
      alert('Error al crear la categoría');
    }
    setCreando(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Categorías</h2>
        <button 
          onClick={() => setMostrarFormulario(true)}
          className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2 px-4 rounded-xl text-sm transition-colors"
        >
          + Nueva
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-gray-800">Nueva Categoría</h3>
          <input
            type="text"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
            placeholder="Nombre de la categoría"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
            maxLength={50}
          />
          <div className="flex gap-2">
            <button
              onClick={crearNuevaCategoria}
              disabled={creando || !nombreCategoria.trim()}
              className="flex-1 bg-vender-gold text-vender-blue font-bold py-2 rounded-xl disabled:opacity-50"
            >
              {creando ? 'Creando...' : 'Crear Categoría'}
            </button>
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setNombreCategoria('');
              }}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {categorias.length === 0 && !mostrarFormulario && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-2 block">🏷️</span>
          <p className="text-gray-500 font-medium">No tienes categorías creadas</p>
          <p className="text-sm text-gray-400 mt-1">Crea categorías para organizar tus productos</p>
        </div>
      )}

      {categorias.length > 0 && (
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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [creando, setCreando] = useState(false);
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('1');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    if (storeId) {
      cargarProductos();
    }
  }, [storeId]);

  const cargarProductos = async () => {
    if (!storeId) return;
    const productosData = await obtenerProductos(storeId);
    setProductos(productosData);
  };

  const crearNuevoProducto = async () => {
    if (!storeId || !nombreProducto.trim() || !precio) return;

    setCreando(true);
    let imagenUrl = '';

    if (imagenFile) {
      setSubiendoImagen(true);
      imagenUrl = await subirImagenProducto(imagenFile, storeId) || '';
      setSubiendoImagen(false);
    }

    const nuevoProducto = await crearProducto(storeId, {
      name: nombreProducto,
      description: descripcion || undefined,
      price: parseFloat(precio),
      stock: parseInt(stock),
      category_id: categoriaId || undefined,
      image_url: imagenUrl || undefined,
    });

    if (nuevoProducto) {
      setProductos([nuevoProducto, ...productos]);
      setNombreProducto('');
      setDescripcion('');
      setPrecio('');
      setStock('1');
      setCategoriaId('');
      setImagenFile(null);
      setMostrarFormulario(false);
    } else {
      alert('Error al crear el producto');
    }
    setCreando(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-vender-blue">Productos</h2>
        <button 
          onClick={() => setMostrarFormulario(true)}
          className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2 px-4 rounded-xl text-sm transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-gray-800">Nuevo Producto</h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              placeholder="Nombre del producto"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Precio *</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-vender-gold focus:outline-none"
            >
              <option value="">Sin categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={crearNuevoProducto}
              disabled={creando || !nombreProducto.trim() || !precio}
              className="flex-1 bg-vender-gold text-vender-blue font-bold py-2 rounded-xl disabled:opacity-50"
            >
              {subiendoImagen ? 'Subiendo imagen...' : creando ? 'Creando...' : 'Crear Producto'}
            </button>
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setNombreProducto('');
                setDescripcion('');
                setPrecio('');
                setStock('1');
                setCategoriaId('');
                setImagenFile(null);
              }}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {productos.length === 0 && !mostrarFormulario && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-2 block">📦</span>
          <p className="text-gray-500 font-medium">No tienes productos creados</p>
          <p className="text-sm text-gray-400 mt-1">Agrega tu primer producto para empezar a vender</p>
        </div>
      )}

      {productos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map((prod) => (
            <div key={prod.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                {prod.image_url ? (
                  <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{prod.name}</p>
                <p className="text-sm text-gray-500">Stock: {prod.stock}</p>
                <p className="text-vender-gold font-bold">${prod.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
