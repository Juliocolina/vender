"use client";

import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { getUser } from "@/lib/supabase/auth";
import {
  obtenerTiendaUsuario,
  obtenerCategorias,
  obtenerProductos,
  crearProducto,
  crearProductosBulk,
  actualizarProducto,
  eliminarProducto,
  subirImagenProducto,
  crearCategoria,
} from "@/lib/supabase/productos";

interface Categoria {
  id: string;
  name: string;
  slug: string;
  productos_count?: number;
}

interface Producto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: string | null;
}

export function MisProductos({ onBack }: { onBack: () => void }) {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar productos cuando cambia la categoría
  useEffect(() => {
    if (storeId) {
      cargarProductos();
    }
  }, [categoriaSeleccionada, storeId]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    const user = await getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    const tiendaId = await obtenerTiendaUsuario(user.id);
    if (!tiendaId) {
      alert("No tienes una tienda configurada");
      setLoading(false);
      return;
    }

    setStoreId(tiendaId);
    const cats = await obtenerCategorias(tiendaId);
    setCategorias(cats);
    setLoading(false);
  };

  const cargarProductos = async () => {
    if (!storeId) return;
    
    const prods = await obtenerProductos(storeId, categoriaSeleccionada || undefined);
    setProductos(prods);
  };

  const handleSubirDesdeGaleria = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !storeId) return;

    setSubiendo(true);

    for (const file of Array.from(files)) {
      // Subir imagen
      const imageUrl = await subirImagenProducto(file, storeId);
      
      // Crear producto
      await crearProducto(storeId, {
        name: file.name.replace(/\.[^/.]+$/, ""),
        price: 0,
        stock: 1,
        image_url: imageUrl || undefined,
        category_id: categoriaSeleccionada || undefined
      });
    }

    await cargarProductos();
    setSubiendo(false);
    alert(`✅ ${files.length} productos creados`);
  };

  const descargarPlantilla = () => {
    const wb = XLSX.utils.book_new();
    const data = [
      ['nombre', 'descripcion', 'precio', 'stock', 'imagen_url'],
      ['Gorra Urbana Negra', 'Gorra ajustable de algodón', '15.99', '50', 'https://ejemplo.com/gorra1.jpg'],
      ['Gorra Vintage', 'Estilo retro, varios colores', '19.99', '30', 'https://ejemplo.com/gorra2.jpg'],
      ['Camiseta Básica', '100% algodón, todas las tallas', '12.50', '100', 'https://ejemplo.com/camiseta1.jpg'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'plantilla_productos.xlsx');
  };

  const handleImportarExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    setSubiendo(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Array<Record<string, unknown>>;
      
      const productosImportar = jsonData.map(row => ({
        name: String(row['nombre'] || 'Sin nombre'),
        description: String(row['descripcion'] || ''),
        price: parseFloat(String(row['precio'] || '0')),
        stock: parseInt(String(row['stock'] || '0')),
        image_url: String(row['imagen_url'] || ''),
        category_id: categoriaSeleccionada || undefined
      }));
      
      const cantidad = await crearProductosBulk(storeId, productosImportar);
      await cargarProductos();
      alert(`✅ ${cantidad} productos importados exitosamente`);
    } catch (error) {
      console.error('Error al importar Excel:', error);
      alert('❌ Error al importar el archivo. Asegúrate de usar el formato correcto.');
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminarProducto = async (productoId: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    const exito = await eliminarProducto(productoId);
    if (exito) {
      await cargarProductos();
    }
  };

  const handleCrearCategoria = async () => {
    const nombre = prompt('Nombre de la categoría:');
    if (!nombre || !storeId) return;

    const nueva = await crearCategoria(storeId, nombre);
    if (nueva) {
      setCategorias([...categorias, nueva]);
    }
  };

  const categoriaActiva = categorias.find(c => c.id === categoriaSeleccionada);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-vender-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
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
          <div className="flex-1">
            <h1 className="text-2xl font-black text-vender-blue">Productos</h1>
            <p className="text-gray-500 text-sm">Gestiona el catálogo de tu tienda</p>
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              categoriaSeleccionada === null
                ? "bg-vender-blue text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <span>📋</span>
            <span>Todas</span>
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                categoriaSeleccionada === cat.id
                  ? "bg-vender-blue text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <span>🏷️</span>
              <span>{cat.name}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {cat.productos_count || 0}
              </span>
            </button>
          ))}
          <button
            onClick={handleCrearCategoria}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <span>+</span>
            <span>Nueva</span>
          </button>
        </div>

        {/* Vista de categorías */}
        {categoriaSeleccionada === null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-vender-gold transition-all group"
              >
                <div className="aspect-square rounded-xl bg-gray-100 mb-4 flex items-center justify-center group-hover:bg-vender-gold/10 transition-colors">
                  <span className="text-5xl opacity-40">🏷️</span>
                </div>
                <h3 className="font-bold text-vender-blue text-left">{cat.name}</h3>
                <p className="text-sm text-gray-500 text-left">{cat.productos_count || 0} productos</p>
              </button>
            ))}
          </div>
        ) : (
          // Vista de productos de una categoría
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCategoriaSeleccionada(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                  aria-label="Volver"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-vender-blue">{categoriaActiva?.name}</h2>
                  <p className="text-sm text-gray-500">{productos.length} productos</p>
                </div>
              </div>

              {/* Menú Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuAbierto(!menuAbierto)}
                  disabled={subiendo}
                  className="text-vender-blue font-bold py-2 px-3 text-sm transition-colors flex items-center gap-1 hover:text-vender-gold disabled:opacity-50"
                >
                  {subiendo ? (
                    <>
                      <div className="w-4 h-4 border-2 border-vender-blue border-t-transparent rounded-full animate-spin" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <span>Subir</span>
                      <svg className={`w-4 h-4 transition-transform ${menuAbierto ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>

                {menuAbierto && !subiendo && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <label className="block px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                      <span className="font-medium text-gray-700">Desde galería</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => { handleSubirDesdeGaleria(e); setMenuAbierto(false); }}
                      />
                    </label>
                    <label className="block px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                      <span className="font-medium text-gray-700">Importar Excel</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={(e) => { handleImportarExcel(e); setMenuAbierto(false); }}
                      />
                    </label>
                    <button
                      onClick={() => { descargarPlantilla(); setMenuAbierto(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-700">Descargar plantilla</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid de productos o estado vacío */}
            {productos.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <span className="text-6xl mb-4 block opacity-50">📦</span>
                <p className="text-gray-500 font-medium mb-2">No tienes productos en esta categoría</p>
                <p className="text-sm text-gray-400 mb-6">Sube múltiples productos desde tu galería</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <label className="cursor-pointer bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 px-6 rounded-xl transition-colors inline-flex items-center gap-2 justify-center">
                    <span className="text-xl">📤</span>
                    <span>Desde galería</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleSubirDesdeGaleria}
                      disabled={subiendo}
                    />
                  </label>
                  <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors inline-flex items-center gap-2 justify-center">
                    <span className="text-xl">📊</span>
                    <span>Importar Excel</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleImportarExcel}
                      disabled={subiendo}
                    />
                  </label>
                  <button
                    onClick={descargarPlantilla}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors inline-flex items-center gap-2 justify-center"
                  >
                    <span className="text-xl">📥</span>
                    <span>Descargar plantilla</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {producto.image_url ? (
                        <img src={producto.image_url} alt={producto.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">📦</div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="bg-white text-vender-blue p-2 rounded-lg hover:bg-gray-100">✏️</button>
                        <button 
                          onClick={() => handleEliminarProducto(producto.id)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-gray-800 truncate">{producto.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-vender-blue font-bold">${producto.price.toFixed(2)}</p>
                        <span className="text-xs text-gray-500">{producto.stock} uds</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
