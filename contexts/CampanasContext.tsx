"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type TipoCampana = "tarjeta" | "historia" | "banner";
type EstadoCampana = "borrador" | "activa" | "pausada" | "completada";

export interface Campana {
  id: number;
  tipo: TipoCampana;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  destinoUrl: string;
  tipoDestino: "whatsapp" | "web" | "instagram" | "facebook" | "tiktok";
  presupuesto: number;
  duracion: number;
  estado: EstadoCampana;
  impresiones: number;
  clics: number;
  fechaInicio: string;
}

interface CampanasContextType {
  campanas: Campana[];
  campanaActivaBanner: Campana | null;
  agregarCampana: (campana: Omit<Campana, "id">) => void;
  toggleEstado: (id: number) => void;
  eliminarCampana: (id: number) => void;
  registrarImpresion: (id: number) => void;
  registrarClic: (id: number) => void;
}

const CampanasContext = createContext<CampanasContextType | undefined>(undefined);

export const tiposDestinoConfig = {
  whatsapp: { label: "WhatsApp", color: "#25D366" },
  web: { label: "Web", color: "#1877F2" },
  instagram: { label: "Instagram", color: "#E1306C" },
  facebook: { label: "Facebook", color: "#1877F2" },
  tiktok: { label: "TikTok", color: "#000000" },
};

export function CampanasProvider({ children }: { children: ReactNode }) {
  const [campanas, setCampanas] = useState<Campana[]>([
    {
      id: 1,
      tipo: "banner",
      titulo: "Grandes Descuentos",
      descripcion: "50% off en toda la tienda",
      imagenUrl: "",
      destinoUrl: "https://wa.me/584141234567",
      tipoDestino: "whatsapp",
      presupuesto: 2.0,
      duracion: 16,
      estado: "activa",
      impresiones: 1250,
      clics: 89,
      fechaInicio: "2025-01-10",
    },
    {
      id: 2,
      tipo: "historia",
      titulo: "Oferta Flash 24h",
      descripcion: "Solo por hoy, no te lo pierdas",
      imagenUrl: "",
      destinoUrl: "https://wa.me/584141234567",
      tipoDestino: "whatsapp",
      presupuesto: 0.5,
      duracion: 1,
      estado: "activa",
      impresiones: 0,
      clics: 0,
      fechaInicio: "2025-01-15",
    },
  ]);

  const campanaActivaBanner = campanas.find(
    (c) => c.tipo === "banner" && c.estado === "activa"
  ) || null;

  const agregarCampana = (campana: Omit<Campana, "id">) => {
    const nuevaCampana: Campana = {
      ...campana,
      id: Date.now(),
    };
    setCampanas((prev) => [nuevaCampana, ...prev]);
  };

  const toggleEstado = (id: number) => {
    setCampanas((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, estado: c.estado === "activa" ? "pausada" : "activa" }
          : c
      )
    );
  };

  const eliminarCampana = (id: number) => {
    setCampanas((prev) => prev.filter((c) => c.id !== id));
  };

  const registrarImpresion = (id: number) => {
    setCampanas((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, impresiones: c.impresiones + 1 } : c
      )
    );
  };

  const registrarClic = (id: number) => {
    setCampanas((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, clics: c.clics + 1 } : c
      )
    );
  };

  return (
    <CampanasContext.Provider
      value={{
        campanas,
        campanaActivaBanner,
        agregarCampana,
        toggleEstado,
        eliminarCampana,
        registrarImpresion,
        registrarClic,
      }}
    >
      {children}
    </CampanasContext.Provider>
  );
}

export function useCampanas() {
  const context = useContext(CampanasContext);
  if (!context) {
    throw new Error("useCampanas debe usarse dentro de CampanasProvider");
  }
  return context;
}
