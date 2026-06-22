"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [storeName, setStoreName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí es donde próximamente conectaremos con tu base de datos
    console.log("Datos de tienda recibidos:", { storeName, whatsapp });
    
    // Redirigimos al usuario al dashboard una vez completado
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1a2f] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-black text-[#0a1a2f] mb-2">¡Casi listo!</h1>
        <p className="text-gray-600 mb-6 text-sm">Configura tu tienda para comenzar a vender con VENDER.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre de tu tienda</label>
            <input 
              required
              type="text" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] outline-none"
              placeholder="Ej: Dulces Detalles"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp de contacto</label>
            <input 
              required
              type="tel" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] outline-none"
              placeholder="+58 412 0000000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#d4af37] text-[#0a1a2f] font-black py-3 rounded-xl hover:bg-[#b8962e] transition-all uppercase tracking-widest text-xs mt-4 shadow-lg active:scale-95"
          >
            Finalizar configuración
          </button>
        </form>
      </div>
    </div>
  );
}