import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-vender-blue">
      {/* SE HA ELIMINADO EL NAVBAR DE AQUÍ PARA EVITAR DUPLICADOS */}

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* TEXTO DE IMPACTO */}
        <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8 z-40">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-vender-blue leading-[1.1] tracking-tight">
            Tú tienes el talento, <br />
            <span className="text-vender-gold underline decoration-vender-blue/10 italic font-black">nosotros la plataforma.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Olvida los 100 estados de WhatsApp desordenados. Pasa a tu propio <span className="text-vender-blue font-bold">catálogo digital profesional</span> en segundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button className="bg-vender-gold hover:bg-[#b8962e] hover:scale-105 transition-all text-vender-blue font-black py-4 lg:py-5 px-8 lg:px-10 rounded-2xl shadow-xl shadow-gold-200 text-base lg:text-lg cursor-pointer">
              COMIENZA A VENDER AHORA
            </button>
            <button className="border-2 border-vender-blue text-vender-blue font-bold py-4 lg:py-5 px-8 lg:px-10 rounded-2xl hover:bg-vender-blue hover:text-white transition-colors text-base lg:text-lg cursor-pointer">
              Ver Demo Live
            </button>
          </div>

          {/* BADGES DE CONFIANZA INTERNACIONAL */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 pt-4 text-[10px] lg:text-sm font-bold text-vender-blue/60 uppercase tracking-widest">
            <div className="flex items-center gap-2"><span>⚡</span> Rápido</div>
            <div className="flex items-center gap-2"><span>🛡️</span> Seguro</div>
            <div className="flex items-center gap-2"><span>🌎</span> Uso Global</div>
          </div>
        </div>

        {/* ÁREA VISUAL */}
        <div className="hidden lg:flex flex-1 relative w-full max-w-2xl h-[500px]">
          
          {/* Dashboard Base */}
          <div className="absolute top-0 right-0 w-[90%] h-full bg-white rounded-[2.5rem] shadow-2xl p-5 border border-gray-100 z-10 overflow-hidden flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="font-black text-vender-blue text-sm">PANEL DE CONTROL</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
              <div className="h-4 w-1/3 bg-gray-200 rounded-full"></div>
              <div className="flex-1 flex gap-2 items-end">
                <div className="flex-1 h-[40%] bg-vender-blue/10 rounded-t-lg"></div>
                <div className="flex-1 h-[70%] bg-vender-gold/40 rounded-t-lg"></div>
                <div className="flex-1 h-[55%] bg-vender-blue/10 rounded-t-lg"></div>
                <div className="flex-1 h-[90%] bg-vender-gold rounded-t-lg"></div>
                <div className="flex-1 h-[45%] bg-vender-blue/10 rounded-t-lg"></div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Producto */}
          <div className="absolute -left-10 bottom-10 w-[45%] aspect-[1.1/1] bg-white rounded-3xl p-3 shadow-xl z-20 border-4 border-white rotate-[-5deg] overflow-hidden transform hover:rotate-0 transition-all duration-300 flex flex-col gap-2">
             <div className="p-2 border-b border-gray-50 flex justify-between items-center bg-white mb-2">
                <span className="font-black text-vender-blue text-[10px] italic tracking-tighter uppercase text-vender-gold">V-Store</span>
                <div className="w-5 h-5 rounded-full bg-vender-gold/20 flex items-center justify-center text-xs">🛒</div>
              </div>
            <div className="relative w-full h-[65%] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
              <div className="text-gray-300 text-4xl font-black">📸</div>
              <div className="absolute top-2 right-2 bg-vender-gold text-vender-blue font-black px-2 py-0.5 rounded-full text-[8px] shadow-lg">
                $5.00
              </div>
            </div>
          </div>

          {/* WhatsApp Dolor */}
          <div className="absolute -top-10 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 rotate-6 z-30">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-red-500 uppercase">WhatsApp</span>
                <span className="text-2xl">❌ 🚮</span>
              </div>
          </div>
        </div>

      </section>

      {/* QUICK FEATURES */}
      <section className="bg-vender-blue py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-white">
          {[
            { title: "Catálogo Digital", desc: "Crea tu tienda en 1 minuto sin saber programar.", icon: "📱" },
            { title: "Métricas Pro", desc: "Gráficos en tiempo real de tus ventas y visitas.", icon: "📈" },
            { title: "Ventas 24/7", desc: "No pierdas clientes mientras duermes.", icon: "⚡" }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <div className="text-4xl lg:text-5xl drop-shadow-lg">{item.icon}</div>
              <div className="space-y-1">
                <h4 className="font-bold text-base lg:text-lg">{item.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE PRECIOS */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-vender-blue tracking-tight">
              Planes que crecen <span className="text-vender-gold italic">contigo.</span>
            </h2>
            <p className="text-gray-500 font-medium">Precios en USD. Elige el motor para tu talento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Emprendedor", price: "0", feat: ["Hasta 10 productos", "Link personalizado", "Soporte básico"], popular: false },
              { name: "Crecimiento", price: "5", feat: ["Productos ilimitados", "Métricas básicas", "Botón de WhatsApp"], popular: false },
              { name: "Profesional", price: "15", feat: ["Dominio propio .com", "Métricas avanzadas", "Gestión de inventario", "Soporte 24/7"], popular: true },
              { name: "Corporativo", price: "29", feat: ["Multitienda", "API para envíos", "Reportes contables", "Manager dedicado"], popular: false }
            ].map((plan, idx) => (
              <div key={idx} className={`relative p-8 rounded-[2rem] border bg-white transition-all hover:scale-105 ${plan.popular ? 'border-vender-gold shadow-2xl z-10' : 'border-gray-100 shadow-sm'}`}>
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-vender-gold text-vender-blue text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                    Más Popular
                  </span>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-vender-blue">${plan.price}</span>
                      <span className="text-gray-400 text-sm">/mes</span>
                    </div>
                  </div>
                  <ul className="space-y-4 py-6 border-y border-gray-50">
                    {plan.feat.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-vender-blue/70 font-medium">
                        <span className="text-vender-gold font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-xl font-black text-xs tracking-widest transition-all ${plan.popular ? 'bg-vender-blue text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-vender-blue hover:bg-vender-gold hover:text-white'}`}>
                    SELECCIONAR PLAN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER INTERNACIONALIZADO */}
      <footer className="bg-vender-blue text-white pt-20 pb-10 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-vender-gold rounded-lg flex items-center justify-center font-black text-vender-blue text-xl">V</div>
                <span className="text-2xl font-black tracking-tighter">VENDER</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Potenciando el comercio digital en <span className="text-white font-medium">Latinoamérica</span>. Diseñado para que el talento regional escale sin límites.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-vender-gold transition-colors text-xl">📸</a>
                <a href="https://wa.me/584121209510" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 transition-colors text-xl">💬</a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-[0.2em] text-vender-gold">Plataforma</h4>
              <ul className="space-y-4 text-gray-400 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo en Vivo</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-[0.2em] text-vender-gold">Ayuda</h4>
              <ul className="space-y-4 text-gray-400 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-[0.2em] text-vender-gold">Contacto</h4>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-start gap-3">
                  <span className="text-vender-gold">📍</span>
                  <span className="text-gray-400">Sede Latam <br /> Conexión Global.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-vender-gold">✉️</span>
                  <a href="mailto:ovender401@gmail.com" className="text-gray-400 hover:text-white">ovender401@gmail.com</a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} VENDER - Todos los derechos reservados.</p>
            <div className="flex gap-8">
              <span>Hecho con ❤️ en Venezuela</span>
              <span className="text-vender-gold/50 italic tracking-widest text-[8px]">v1.0.4-REGIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}