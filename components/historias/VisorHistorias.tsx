"use client";

import { useEffect, useState, useRef } from "react";
import { Historia } from "@/contexts/HistoriasContext";

interface VisorHistoriasProps {
  historias: Historia[];
  indiceInicial: number;
  onClose: () => void;
  onVista: (id: string) => void;
}

export function VisorHistorias({ historias, indiceInicial, onClose, onVista }: VisorHistoriasProps) {
  const [indiceActual, setIndiceActual] = useState(indiceInicial);
  const [progreso, setProgreso] = useState(0);
  const [mounted, setMounted] = useState(false);

  const historiaActual = historias[indiceActual];
  const duracion = historiaActual?.tipo === "publicidad" ? 10000 : 5000;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !historiaActual) return;

    if (!historiaActual.vista) {
      onVista(historiaActual.id);
    }

    const timer = setInterval(() => {
      setProgreso(prev => {
        if (prev >= 100) {
          return prev + 2;
        }
        return prev + 2;
      });
    }, duracion / 50);

    return () => clearInterval(timer);
  }, [indiceActual, mounted]);

  useEffect(() => {
    if (progreso >= 100) {
      siguienteHistoria();
    }
  }, [progreso]);

  const siguienteHistoria = () => {
    setProgreso(0);
    if (indiceActual < historias.length - 1) {
      setIndiceActual(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const anteriorHistoria = () => {
    setProgreso(0);
    if (indiceActual > 0) {
      setIndiceActual(prev => prev - 1);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const mitad = rect.width / 2;

    if (x < mitad) {
      anteriorHistoria();
    } else {
      siguienteHistoria();
    }
  };

  if (!historiaActual) return null;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header con barras de progreso */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2 pt-4">
        <div className="flex gap-1 mb-3">
          {historias.map((h, i) => (
            <div key={h.id} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: i < indiceActual ? "100%" : i === indiceActual ? `${progreso}%` : "0%" }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full p-0.5 ${
              historiaActual.tipo === "publicidad" 
                ? "bg-vender-gold" 
                : "bg-gradient-to-tr from-vender-gold to-yellow-300"
            }`}>
              <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                {historiaActual.nombre.charAt(0)}
              </div>
            </div>
            <div>
              <p className="text-white text-xs font-bold flex items-center gap-1">
                {historiaActual.nombre}
                {historiaActual.tipo === "publicidad" && (
                  <span className="text-[8px] bg-vender-gold text-vender-blue px-1 rounded">AD</span>
                )}
              </p>
              <p className="text-white/60 text-[10px]">
                {historiaActual.tipo === "publicidad" ? "Publicidad" : "Hace 2h"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido de la historia */}
      <div
        className="flex-1 flex items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        {historiaActual.imagenUrl ? (
          <img
            src={historiaActual.imagenUrl}
            alt={historiaActual.nombre}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-vender-blue to-vender-dark flex flex-col items-center justify-center p-8 text-center">
            <span className="text-6xl mb-4">
              {historiaActual.tipo === "publicidad" ? "📢" : "📸"}
            </span>
            <h2 className="text-white text-xl font-black mb-2">{historiaActual.nombre}</h2>
            {historiaActual.tipo === "publicidad" && (
              <p className="text-vender-gold text-sm">Oferta especial por tiempo limitado</p>
            )}
          </div>
        )}
      </div>

      {/* Footer con CTA para publicidades */}
      {historiaActual.tipo === "publicidad" && (
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <button className="w-full bg-vender-gold text-vender-blue font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <span>Ver oferta</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
