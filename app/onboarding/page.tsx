"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// @ts-ignore 
import { getNames } from 'country-list';

export default function OnboardingPage() {
  const countries = getNames();
  const [storeName, setStoreName] = useState("");
  const [whatsapp, setWhatsapp] = useState(""); 
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Inicia sesión nuevamente.");
      
      // Corrección: Aseguramos que el número tenga un solo '+' al inicio
      const formattedWhatsapp = whatsapp.startsWith('+') ? `+${whatsapp}` : `+${whatsapp}`;
      const cleanWhatsapp = formattedWhatsapp.replace('++', '+');

      const { data, error: saveError } = await supabase
        .from('stores')
        .insert([{
            user_id: user.id,
            name: storeName,
            whatsapp: cleanWhatsapp,
            country: country,
        }])
        .select();
        
      if (saveError) throw saveError;
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1a2f] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-black text-[#0a1a2f] mb-2">¡Casi listo!</h1>
        <p className="text-gray-600 mb-6 text-sm">Configura tu tienda para comenzar a bueno, ya sabes, VENDER.</p>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre de tu tienda</label>
            <input required type="text" className="w-full p-3 border border-gray-200 rounded-xl" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">País de residencia</label>
            <select required className="w-full p-3 border border-gray-200 rounded-xl" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Selecciona tu país</option>
              {countries.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp de contacto</label>
            <PhoneInput
              country={'ve'}
              value={whatsapp}
              onChange={(phone) => setWhatsapp(phone)}
              enableSearch={true}
              inputClass="!w-full !p-6 !pl-16 !border !border-gray-200 !rounded-xl"
              containerClass="!w-full"
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-[#d4af37] text-[#0a1a2f] font-black py-3 rounded-xl uppercase tracking-widest text-xs mt-4">
            {loading ? "Guardando..." : "Finalizar configuración"}
          </button>
        </form>
      </div>
    </div>
  );
}
