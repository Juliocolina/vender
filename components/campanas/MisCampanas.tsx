"use client";

import { useState, useRef } from "react";
import { useCampanas, Campana } from "@/contexts/CampanasContext";
import { tiposDestinoConfig } from "@/contexts/CampanasContext";

type TipoCampana = "tarjeta" | "historia" | "banner";

interface NuevaCampana {
  tipo: TipoCampana;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  destinoUrl: string;
  tipoDestino: "whatsapp" | "web" | "instagram" | "facebook" | "tiktok";
  duracion: number;
}

export function MisCampanas({ onBack }: { onBack: () => void }) {
  const { campanas, agregarCampana, toggleEstado, eliminarCampana } = useCampanas();
  const [paso, setPaso] = useState(1);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevaCampana, setNuevaCampana] = useState<NuevaCampana>({
    tipo: "banner",
    titulo: "",
    descripcion: "",
    imagenUrl: "",
    destinoUrl: "",
    tipoDestino: "whatsapp",
    duracion: 4,
  });

  const archivoInputRef = useRef<HTMLInputElement>(null);

  const calcularCosto = (dias: number) => (dias / 4) * 0.5;

  const handleCrearCampana = () => {
    const costo = calcularCosto(nuevaCampana.duracion);
    agregarCampana({
      ...nuevaCampana,
      presupuesto: costo,
      estado: "activa",
      impresiones: 0,
      clics: 0,
      fechaInicio: new Date().toISOString().split("T")[0],
    });
    setMostrarFormulario(false);
    setPaso(1);
    setNuevaCampana({
      tipo: "banner",
      titulo: "",
      descripcion: "",
      imagenUrl: "",
      destinoUrl: "",
      tipoDestino: "whatsapp",
      duracion: 4,
    });
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNuevaCampana({ ...nuevaCampana, imagenUrl: url });
    }
  };

  const getEstadoColor = (estado: Campana["estado"]) => {
    switch (estado) {
      case "activa": return "bg-green-500";
      case "pausada": return "bg-yellow-500";
      case "completada": return "bg-gray-400";
      default: return "bg-gray-300";
    }
  };

  // Wizard de creación
  if (mostrarFormulario) {
    return (
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setPaso(1);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-vender-blue">Nueva Campaña</h1>
              <p className="text-gray-500 text-sm">Configura tu publicidad en 3 pasos</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  paso >= num ? "bg-vender-gold text-vender-blue" : "bg-gray-200 text-gray-400"
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded transition-all ${
                    paso > num ? "bg-vender-gold" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Paso 1: Tipo de campaña */}
          {paso === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-center text-gray-700 mb-6">¿Qué quieres promocionar?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "tarjeta" as TipoCampana, icon: "🃏", titulo: "Tarjeta", desc: "Promociona un producto en el feed" },
                  { id: "historia" as TipoCampana, icon: "📖", titulo: "Historia", desc: "Oferta temporal de 24h" },
                  { id: "banner" as TipoCampana, icon: "📢", titulo: "Banner Footer", desc: "Tráfico directo a tu canal" },
                ].map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => setNuevaCampana({ ...nuevaCampana, tipo: tipo.id })}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      nuevaCampana.tipo === tipo.id
                        ? "border-vender-gold bg-vender-gold/10 shadow-lg"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-4xl block mb-3">{tipo.icon}</span>
                    <h3 className="font-bold text-gray-800">{tipo.titulo}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tipo.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setPaso(2)}
                  className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Contenido */}
          {paso === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Configura tu anuncio</h2>
                
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Título</label>
                  <input
                    type="text"
                    value={nuevaCampana.titulo}
                    onChange={(e) => setNuevaCampana({ ...nuevaCampana, titulo: e.target.value })}
                    placeholder="Ej: Grandes descuentos"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vender-gold focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Descripción</label>
                  <textarea
                    value={nuevaCampana.descripcion}
                    onChange={(e) => setNuevaCampana({ ...nuevaCampana, descripcion: e.target.value })}
                    placeholder="Ej: 50% de descuento en toda la tienda"
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vender-gold focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={archivoInputRef}
                    onChange={handleImagenChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => archivoInputRef.current?.click()}
                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-vender-gold transition-colors text-gray-500"
                  >
                    {nuevaCampana.imagenUrl ? (
                      <img src={nuevaCampana.imagenUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg mx-auto" />
                    ) : (
                      <span>📤 Subir imagen</span>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Destino del tráfico</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(tiposDestinoConfig).map(([id, config]) => (
                      <button
                        key={id}
                        onClick={() => setNuevaCampana({ ...nuevaCampana, tipoDestino: id as NuevaCampana["tipoDestino"] })}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          nuevaCampana.tipoDestino === id
                            ? "text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                        style={{
                          backgroundColor: nuevaCampana.tipoDestino === id ? config.color : undefined
                        }}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={nuevaCampana.destinoUrl}
                    onChange={(e) => setNuevaCampana({ ...nuevaCampana, destinoUrl: e.target.value })}
                    placeholder="https://wa.me/584141234567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vender-gold focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-500 mb-4 text-center">VISTA PREVIA</h3>
                <div className="bg-[#1e293b] rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {nuevaCampana.imagenUrl ? (
                        <img src={nuevaCampana.imagenUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-[10px] font-bold">IMG</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">
                        {nuevaCampana.titulo || "Título de tu campaña"}
                      </h4>
                      <p className="text-gray-400 text-xs truncate">
                        {nuevaCampana.descripcion || "Descripción de tu oferta"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="px-4 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: tiposDestinoConfig[nuevaCampana.tipoDestino].color }}
                    >
                      {tiposDestinoConfig[nuevaCampana.tipoDestino].label}
                    </button>
                    <button className="bg-vender-gold text-vender-blue px-4 py-1.5 rounded-full text-xs font-bold">
                      Ver más
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between col-span-1 lg:col-span-2">
                <button
                  onClick={() => setPaso(1)}
                  className="text-gray-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setPaso(3)}
                  disabled={!nuevaCampana.titulo || !nuevaCampana.destinoUrl}
                  className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Presupuesto */}
          {paso === 3 && (
            <div className="max-w-md mx-auto space-y-6">
              <h2 className="text-lg font-bold text-center text-gray-700 mb-6">Define tu presupuesto</h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Duración (días)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="4"
                    max="32"
                    step="4"
                    value={nuevaCampana.duracion}
                    onChange={(e) => setNuevaCampana({ ...nuevaCampana, duracion: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-vender-gold"
                  />
                  <span className="w-16 text-center font-bold text-lg text-vender-blue">{nuevaCampana.duracion}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>4 días</span>
                  <span>1 mes</span>
                </div>
              </div>

              {/* Resumen de costos */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duración</span>
                  <span className="font-bold">{nuevaCampana.duracion} días</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ciclos de 4 días</span>
                  <span className="font-bold">{nuevaCampana.duracion / 4}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costo por ciclo</span>
                  <span className="font-bold">$0.50</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="font-bold text-gray-700">Total a pagar</span>
                  <span className="font-black text-2xl text-vender-gold">${calcularCosto(nuevaCampana.duracion).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setPaso(2)}
                  className="text-gray-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handleCrearCampana}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>💳</span>
                  <span>Activar y Pagar ${calcularCosto(nuevaCampana.duracion).toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista principal de campañas
  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-vender-blue">Campañas</h1>
            <p className="text-gray-500 text-sm">Gestiona tu publicidad y obtén resultados</p>
          </div>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
          >
            + Nueva
          </button>
        </div>

        {/* Métricas generales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Campañas activas", valor: campanas.filter(c => c.estado === "activa").length, icon: "📢" },
            { label: "Impresiones", valor: campanas.reduce((acc, c) => acc + c.impresiones, 0).toLocaleString(), icon: "👁️" },
            { label: "Clics totales", valor: campanas.reduce((acc, c) => acc + c.clics, 0).toLocaleString(), icon: "👆" },
            { label: "Inversión total", valor: `$${campanas.reduce((acc, c) => acc + c.presupuesto, 0).toFixed(2)}`, icon: "💰" },
          ].map((metrica) => (
            <div key={metrica.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <span className="text-lg">{metrica.icon}</span>
              <p className="font-black text-xl text-vender-blue mt-1">{metrica.valor}</p>
              <p className="text-xs text-gray-500">{metrica.label}</p>
            </div>
          ))}
        </div>

        {/* Lista de campañas */}
        {campanas.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <span className="text-6xl mb-4 block opacity-50">📢</span>
            <p className="text-gray-500 font-medium mb-2">No tienes campañas activas</p>
            <p className="text-sm text-gray-400 mb-6">Crea tu primera campaña y empieza a recibir tráfico</p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Crear primera campaña
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {campanas.map((campana) => (
              <div
                key={campana.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {campana.imagenUrl ? (
                      <img src={campana.imagenUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{campana.tipo === "banner" ? "📢" : campana.tipo === "historia" ? "📖" : "🃏"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 truncate">{campana.titulo}</h3>
                      <span className={`w-2 h-2 rounded-full ${getEstadoColor(campana.estado)}`} />
                    </div>
                    <p className="text-sm text-gray-500 truncate">{campana.descripcion}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400">
                        {campana.impresiones.toLocaleString()} impresiones
                      </span>
                      <span className="text-xs text-gray-400">
                        {campana.clics.toLocaleString()} clics
                      </span>
                      <span className="text-xs text-gray-400">
                        ${campana.presupuesto.toFixed(2)} gastado
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEstado(campana.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        campana.estado === "activa"
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title={campana.estado === "activa" ? "Pausar" : "Activar"}
                    >
                      {campana.estado === "activa" ? "⏸️" : "▶️"}
                    </button>
                    <button
                      onClick={() => eliminarCampana(campana.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
