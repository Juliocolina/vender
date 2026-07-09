"use client";

import { useRef, useState } from "react";
import { useHistorias, Historia } from "@/contexts/HistoriasContext";
import { VisorHistorias } from "./VisorHistorias";

export function Historias() {
  const { historias, misHistorias, agregarHistoria, marcarVista, loading } = useHistorias();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [indiceVisor, setIndiceVisor] = useState(0);
  const archivoRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 120;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSubirHistoria = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubiendo(true);
      await agregarHistoria(file);
      setSubiendo(false);
    }
  };

  const abrirHistoria = (indice: number) => {
    setIndiceVisor(indice);
    setMostrarVisor(true);
  };

  // Mi historia es la última de misHistorias (si hay)
  const miHistoria = misHistorias.length > 0 ? misHistorias[0] : null;
  
  // Ordenar: Mi historia primero, luego publicidades, luego otras tiendas
  const historiasOrdenadas = [
    ...(miHistoria ? [miHistoria] : []),
    ...historias.filter(h => h.tipo === "publicidad"),
    ...historias.filter(h => h.tipo === "tienda"),
  ];

  return (
    <>
      <div className="w-full max-w-full overflow-hidden">
        <div className="relative flex items-center group">
          {/* Botón izquierda */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 z-10 bg-white/90 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scroll de historias */}
          <div
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto py-1 px-1 w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Botón subir mi historia */}
            <div className="flex flex-col items-center flex-shrink-0">
              <label className="relative w-12 h-12 rounded-full border-2 border-dashed border-vender-gold flex items-center justify-center cursor-pointer hover:bg-vender-gold/10 transition-colors overflow-hidden">
                {subiendo ? (
                  <div className="w-5 h-5 border-2 border-vender-gold border-t-transparent rounded-full animate-spin" />
                ) : miHistoria?.imagenUrl ? (
                  <img src={miHistoria.imagenUrl} alt="Mi historia" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-xl text-vender-gold">+</span>
                )}
                <input
                  ref={archivoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSubirHistoria}
                  disabled={subiendo}
                />
              </label>
              <span className="text-[9px] text-gray-300 mt-1 max-w-[48px] truncate text-center">
                {subiendo ? "Subiendo..." : miHistoria ? "Mi historia" : "Subir"}
              </span>
            </div>

            {/* Historias de otros y publicidades */}
            {historiasOrdenadas.map((historia, index) => (
              <button
                key={historia.id}
                onClick={() => abrirHistoria(index)}
                className="flex flex-col items-center flex-shrink-0 group"
              >
                <div className={`w-12 h-12 rounded-full p-0.5 ${
                  historia.tipo === "publicidad"
                    ? "bg-vender-gold shadow-lg shadow-vender-gold/30"
                    : historia.vista
                    ? "bg-gray-600"
                    : "bg-gradient-to-tr from-vender-gold to-yellow-300"
                }`}>
                  <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {historia.imagenUrl ? (
                      <img src={historia.imagenUrl} alt={historia.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {historia.nombre.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-[9px] mt-1 max-w-[48px] truncate text-center ${
                  historia.tipo === "publicidad" ? "text-vender-gold font-bold" : "text-gray-300"
                }`}>
                  {historia.nombre}
                </span>
              </button>
            ))}
          </div>

          {/* Botón derecha */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 z-10 bg-white/90 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Visor de historias */}
      {mostrarVisor && (
        <VisorHistorias
          historias={historiasOrdenadas}
          indiceInicial={indiceVisor}
          onClose={() => setMostrarVisor(false)}
          onVista={marcarVista}
        />
      )}
    </>
  );
}
