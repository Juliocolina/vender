"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const countries = [
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
];

export default function OnboardingPage() {
  const [storeName, setStoreName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Inicia sesión nuevamente.");
      
      const formattedWhatsapp = whatsapp.startsWith('+') ? `+${whatsapp}` : `+${whatsapp}`;
      const cleanWhatsapp = formattedWhatsapp.replace('++', '+');

      const { data: store, error: saveError } = await supabase
        .from('stores')
        .insert([{
          user_id: user.id,
          name: storeName,
          whatsapp: cleanWhatsapp,
          country: country,
        }])
        .select()
        .single();
        
      if (saveError) throw saveError;
      
      if (store) {
        await supabase
          .from('perfiles')
          .update({ tienda_id: store.id })
          .eq('id', user.id);
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canContinue = step === 1 ? storeName.length >= 3 : step === 2 ? whatsapp.length >= 10 : true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#0f2847] to-[#0a1a2f] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-white tracking-wider">VENDER</h1>
        <p className="text-vender-gold text-sm mt-1">Tu tienda en minutos</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 mx-0.5 rounded-full transition-all ${s <= step ? 'bg-vender-gold' : 'bg-white/20'}`} />
          ))}
        </div>
        <p className="text-white/60 text-xs text-center">Paso {step} de 3</p>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header dinámico */}
          <div className="bg-gradient-to-r from-vender-blue to-[#0f2847] p-6 text-center">
            {step === 1 && (
              <>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🏪</span>
                </div>
                <h2 className="text-xl font-bold text-white">¿Cómo se llama tu tienda?</h2>
                <p className="text-white/70 text-sm mt-1">El nombre que tus clientes verán</p>
              </>
            )}
            {step === 2 && (
              <>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">📱</span>
                </div>
                <h2 className="text-xl font-bold text-white">WhatsApp de contacto</h2>
                <p className="text-white/70 text-sm mt-1">Tus clientes te escribirán aquí</p>
              </>
            )}
            {step === 3 && (
              <>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🌎</span>
                </div>
                <h2 className="text-xl font-bold text-white">¿Desde dónde vendes?</h2>
                <p className="text-white/70 text-sm mt-1">Para mostrarte precios locales</p>
              </>
            )}
          </div>

          {/* Contenido */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Ej: TechStore, ModaStyle..."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-vender-gold focus:outline-none transition-colors"
                  maxLength={50}
                />
                <p className="text-gray-400 text-xs text-center">{storeName.length}/50 caracteres</p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <PhoneInput
                  country={'ve'}
                  value={whatsapp}
                  onChange={(phone) => setWhatsapp(phone)}
                  enableSearch={true}
                  placeholder="Número de WhatsApp"
                  inputClass="!w-full !p-4 !pl-16 !text-lg !border-2 !border-gray-200 !rounded-xl focus:!border-vender-gold"
                  containerClass="!w-full"
                  buttonClass="!border-2 !border-gray-200 !rounded-l-xl"
                />
                <p className="text-gray-400 text-xs text-center">Incluye el código de país</p>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCountry(c.code)}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                      country === c.code
                        ? 'border-vender-gold bg-vender-gold/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-sm font-medium text-gray-700">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer con botones */}
          <div className="p-6 pt-0 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canContinue}
                className="flex-1 bg-vender-gold text-vender-blue font-black py-3 px-4 rounded-xl uppercase tracking-wide hover:bg-[#b8962e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !country}
                className="flex-1 bg-vender-gold text-vender-blue font-black py-3 px-4 rounded-xl uppercase tracking-wide hover:bg-[#b8962e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-vender-blue border-t-transparent rounded-full animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Crear mi tienda</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-white/40 text-xs mt-8 text-center">
        Al continuar, aceptas nuestros términos de servicio
      </p>
    </div>
  );
}
