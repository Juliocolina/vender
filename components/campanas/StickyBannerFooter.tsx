"use client";

import { useEffect, useState } from "react";
import { useCampanas, tiposDestinoConfig } from "@/contexts/CampanasContext";

export function StickyBannerFooter() {
  const { campanas, registrarClic } = useCampanas();
  const [indiceActual, setIndiceActual] = useState(0);

  // Filtrar solo campañas banner activas
  const campanasActivas = campanas.filter(
    (c) => c.tipo === "banner" && c.estado === "activa"
  );

  // Rotación automática cada 5 segundos
  useEffect(() => {
    if (campanasActivas.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % campanasActivas.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [campanasActivas.length]);

  // Indicadores de progreso
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    if (campanasActivas.length <= 1) return;

    setProgreso(0);
    const duracion = 5000;
    const paso = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += paso;
      setProgreso((elapsed / duracion) * 100);
      if (elapsed >= duracion) {
        elapsed = 0;
      }
    }, paso);

    return () => clearInterval(timer);
  }, [indiceActual, campanasActivas.length]);

  // Sin campañas activas - mostrar banner por defecto
  if (campanasActivas.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 md:left-56 lg:left-64 right-0 bg-[#1e293b] p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-50 flex items-center justify-between border-t border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold text-white text-[10px]">
            V
          </div>
          <div>
            <h3 className="text-white font-black text-xs md:text-sm">
              STICKY BANNER FOOTER
            </h3>
            <p className="text-gray-400 text-[9px] md:text-[10px]">
              Crea tu campaña y aparece aquí
            </p>
          </div>
        </div>
        <button className="bg-vender-gold text-vender-blue px-4 py-1.5 rounded-full text-[10px] font-bold">
          Crear campaña
        </button>
      </div>
    );
  }

  const campanaActual = campanasActivas[indiceActual];
  const destConfig = tiposDestinoConfig[campanaActual.tipoDestino];

  const handleClick = () => {
    registrarClic(campanaActual.id);
    if (campanaActual.destinoUrl) {
      window.open(campanaActual.destinoUrl, "_blank");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 md:left-56 lg:left-64 right-0 bg-[#1e293b] shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-50 border-t border-gray-600">
      {/* Barra de progreso */}
      {campanasActivas.length > 1 && (
        <div className="h-0.5 bg-gray-700">
          <div
            className="h-full bg-vender-gold transition-all duration-100"
            style={{ width: `${progreso}%` }}
          />
        </div>
      )}

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {campanaActual.imagenUrl ? (
              <img
                src={campanaActual.imagenUrl}
                alt={campanaActual.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-[10px] font-bold">
                {campanaActual.titulo.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-black text-xs md:text-sm truncate">
              {campanaActual.titulo}
            </h3>
            <p className="text-gray-400 text-[9px] md:text-[10px] truncate">
              {campanaActual.descripcion}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClick}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: destConfig.color }}
          >
            {destConfig.label}
          </button>
          <button
            onClick={handleClick}
            className="bg-vender-gold text-vender-blue px-3 py-1.5 rounded-full text-[10px] font-bold transition-transform hover:scale-105"
          >
            Ver más
          </button>

          {/* Indicadores de carrusel */}
          {campanasActivas.length > 1 && (
            <div className="flex gap-1 ml-2">
              {campanasActivas.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndiceActual(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === indiceActual ? "bg-vender-gold w-3" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
