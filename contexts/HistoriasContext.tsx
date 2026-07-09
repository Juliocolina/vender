"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getUser } from "@/lib/supabase/auth";
import { obtenerTiendaUsuario } from "@/lib/supabase/productos";
import {
  crearHistoria,
  obtenerMisHistorias,
  obtenerHistoriasTiendas,
  eliminarHistoriaDB,
  subirImagenHistoria,
  HistoriaDB
} from "@/lib/supabase/historias";

export interface Historia {
  id: string;
  nombre: string;
  imagenUrl: string;
  tipo: "mia" | "tienda" | "publicidad";
  storeId?: string;
  vistas: number;
  timestamp: number;
  vista: boolean;
}

interface HistoriasContextType {
  historias: Historia[];
  misHistorias: Historia[];
  loading: boolean;
  agregarHistoria: (file: File) => Promise<void>;
  marcarVista: (id: string) => void;
  eliminarHistoria: (id: string) => void;
  recargarHistorias: () => Promise<void>;
}

const HistoriasContext = createContext<HistoriasContextType | undefined>(undefined);

export function HistoriasProvider({ children }: { children: ReactNode }) {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [misHistorias, setMisHistorias] = useState<Historia[]>([]);
  const [historiasTiendas, setHistoriasTiendas] = useState<Historia[]>([]);
  const [historiasPublicitarias, setHistoriasPublicitarias] = useState<Historia[]>([]);
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    
    const user = await getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const tid = await obtenerTiendaUsuario(user.id);
    if (tid) {
      setStoreId(tid);
      await recargarHistorias(tid);
    }
    
    setLoading(false);
  };

  const recargarHistorias = async (sid?: string) => {
    const tiendaId = sid || storeId;
    if (!tiendaId) return;

    const misHistoriasDB = await obtenerMisHistorias(tiendaId);
    const misHistoriasConvertidas: Historia[] = misHistoriasDB.map(h => ({
      id: h.id,
      nombre: "Mi historia",
      imagenUrl: h.image_url || "",
      tipo: "mia" as const,
      storeId: h.store_id || undefined,
      vistas: h.views,
      timestamp: new Date(h.created_at).getTime(),
      vista: true
    }));
    setMisHistorias(misHistoriasConvertidas);

    const historiasTiendasDB = await obtenerHistoriasTiendas(tiendaId);
    const historiasTiendasConvertidas: Historia[] = historiasTiendasDB.map(h => ({
      id: h.id,
      nombre: (h as any).stores?.name || "Tienda",
      imagenUrl: h.image_url || "",
      tipo: "tienda" as const,
      storeId: h.store_id || undefined,
      vistas: h.views,
      timestamp: new Date(h.created_at).getTime(),
      vista: false
    }));
    setHistoriasTiendas(historiasTiendasConvertidas);

    setHistoriasPublicitarias([]);
  };

  const historias = [...historiasTiendas, ...historiasPublicitarias];

  const agregarHistoria = async (file: File): Promise<void> => {
    if (!storeId) {
      alert("No tienes una tienda configurada");
      return;
    }

    try {
      const imageUrl = await subirImagenHistoria(file, storeId);
      if (!imageUrl) {
        alert("Error subiendo imagen");
        return;
      }

      const nueva = await crearHistoria(storeId, imageUrl, "product");
      if (nueva) {
        await recargarHistorias();
      }
    } catch (error) {
      console.error("Error creando historia:", error);
      alert("Error al crear la historia");
    }
  };

  const marcarVista = (id: string) => {
    setVistas(prev => new Set([...prev, id]));
  };

  const eliminarHistoria = async (id: string) => {
    const exito = await eliminarHistoriaDB(id);
    if (exito) {
      setMisHistorias(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <HistoriasContext.Provider
      value={{
        historias,
        misHistorias,
        loading,
        agregarHistoria,
        marcarVista,
        eliminarHistoria,
        recargarHistorias: () => recargarHistorias()
      }}
    >
      {children}
    </HistoriasContext.Provider>
  );
}

export function useHistorias() {
  const context = useContext(HistoriasContext);
  if (!context) {
    throw new Error("useHistorias debe usarse dentro de HistoriasProvider");
  }
  return context;
}
