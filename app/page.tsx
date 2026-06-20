import React from 'react';
import { Logo } from '@/components/Logo';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-vender-blue overflow-x-hidden">
      
      {/* --- SECCIÓN HERO - ESTRATEGIA: DEL CAOS AL ORDEN --- */}
      <section id="solucion" className="relative pt-16 lg:pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* IZQUIERDA: TEXTO DE IMPACTO */}
        <div className="flex-1 text-center lg:text-left space-y-8 z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-vender-blue leading-tight tracking-tight">
            Tú tienes el talento, <br />
            <span className="text-vender-gold italic drop-shadow-sm">nosotros la plataforma.</span>
          </h1>
          
          <div className="space-y-4">
            <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Olvida los <span className="relative inline-block px-1">
                <span className="line-through decoration-red-500 decoration-2">100 estados de WhatsApp desordenados</span>
              </span>.
            </p>

            {/* BOTÓN CON NUEVO COPY */}
            <div className="pt-4">
              <button className="bg-vender-blue text-white font-black py-4 px-10 rounded-2xl text-lg hover:bg-vender-dark transition-all shadow-xl hover:scale-105 uppercase tracking-widest">
                Haz crecer mis ventas hoy
              </button>
            </div>

            {/* LÍNEA DE PRUEBA SOCIAL */}
            <div className="mt-6 text-center lg:text-left">
              <p className="text-gray-500 font-medium text-sm">
                Únete a más de <span className="font-bold text-vender-blue underline decoration-vender-gold">500+ emprendedores</span> que ya usan VENDER.
              </p>
            </div>
          </div>
        </div>

        {/* DERECHA: VISUAL DE LA SOLUCIÓN */}
        <div className="flex-1 relative w-full flex justify-center lg:justify-center items-center mt-12 lg:mt-0">
          
          {/* Contenedor para la imagen */}
          <div className="relative w-full max-w-3xl flex items-center justify-center">
            
            {/* Imagen principal */}
            <div className="relative w-[300px] sm:w-[400px] lg:w-[500px] h-[400px] sm:h-[500px] lg:h-[600px] shadow-2xl rounded-[2.5rem] overflow-hidden border-8 border-white transition-transform duration-500 hover:scale-105">
              <Image
                src="/whatsapp-catalogo.webp"
                alt="Transición de WhatsApp a Catálogo Digital"
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 500px"
                className="object-cover"
                priority
                quality={85}
              />
              
              {/* Indicador visual minimalista */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 text-vender-blue px-4 py-2 rounded-xl font-medium text-xs shadow-md border border-vender-blue/10 backdrop-blur-sm">
                <span className="flex items-center gap-1.5">
                  <span className="text-red-500 font-semibold">WhatsApp</span>
                  <span className="text-gray-400 text-[10px]">→</span>
                  <span className="text-vender-gold font-semibold">Catálogo Profesional</span>
                </span>
              </div>
            </div>
            
            {/* Efectos decorativos */}
            <div className="absolute -z-10 w-[320px] sm:w-[420px] lg:w-[520px] h-[420px] sm:h-[520px] lg:h-[620px] bg-gradient-to-br from-vender-gold/10 to-vender-blue/10 rounded-[2.7rem] blur-sm"></div>
            
          </div>

        </div>
      </section>

      {/* --- FOOTER UNIFICADO --- */}
      <footer id="contacto" className="bg-vender-dark text-white py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="h-8">
              <Logo className="text-white" />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              La plataforma que transforma el talento local en negocios digitales de alto valor.
            </p>
          </div>

          <div className="space-y-4 md:justify-self-center">
            <h4 className="font-bold uppercase text-[10px] tracking-[0.2em] text-vender-gold">Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
            </ul>
          </div>

          <div className="space-y-4 md:justify-self-end">
            <h4 className="font-bold uppercase text-[10px] tracking-[0.2em] text-vender-gold">Contacto</h4>
            <div className="space-y-2 text-xs sm:text-sm text-gray-400">
              <p>📍 Sede Latam</p>
              <p className="hover:text-white transition-colors">✉️ ovender401@gmail.com</p>
            </div>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} VENDER — Hecho con ❤️ en Venezuela[cite: 2]
        </div>
      </footer>
      
    </div>
  );
}