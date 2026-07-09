"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "@/lib/supabase/auth";
import { Logo } from "@/components/Logo";
import { Historias } from "@/components/historias/Historias";
import { CampanasProvider } from "@/contexts/CampanasContext";
import { HistoriasProvider } from "@/contexts/HistoriasContext";

const menuItems = [
  { icon: "🏠", label: "Inicio", href: "/dashboard" },
  { icon: "📋", label: "Pedidos", href: "/dashboard/pedidos" },
  { icon: "👥", label: "Clientes", href: "/dashboard/clientes" },
  { icon: "📊", label: "Reportes", href: "/dashboard/reportes" },
  { icon: "🔔", label: "Notificaciones", href: "/dashboard/notificaciones" },
  { icon: "✉️", label: "Mensajes", href: "/dashboard/mensajes" },
  { icon: "⚙️", label: "Configuración", href: "/dashboard/configuracion" },
  { icon: "🔗", label: "Referidos", href: "/dashboard/referidos" },
  { icon: "❓", label: "Soporte", href: "/dashboard/soporte" },
  { icon: "👤", label: "Mi Perfil", href: "/dashboard/perfil" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const MenuItem = ({ item, onClick }: { item: typeof menuItems[0]; onClick?: () => void }) => (
    <a
      href={item.href}
      className="flex items-center gap-3 p-2.5 lg:p-3 text-gray-300 hover:text-vender-gold rounded-lg text-sm transition-colors"
      onClick={onClick}
    >
      <span className="text-lg">{item.icon}</span>
      <span className="font-bold text-xs tracking-wider">{item.label.toUpperCase()}</span>
    </a>
  );

  return (
    <CampanasProvider>
      <HistoriasProvider>
    <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
      {/* Menú lateral izquierdo - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-56 lg:w-64 bg-vender-dark border-r border-white/10 p-4 lg:p-6 hidden md:flex flex-col z-20">
        <div className="h-8 mb-6 lg:mb-8">
          <Logo className="text-white" />
        </div>
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(212, 175, 55, 0.5);
          }
        `}</style>
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </nav>
      </aside>

      {/* Overlay para menú móvil */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menú hamburguesa - Móvil */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-vender-dark shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-6">
            <div className="h-7">
              <Logo className="text-white" />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-2xl hover:text-vender-gold transition-colors"
            >
              &times;
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <MenuItem key={item.label} item={item} onClick={() => setMobileMenuOpen(false)} />
            ))}
          </nav>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 mt-4 w-full p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm font-bold border border-red-400/30 transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span className="text-xs tracking-wider">CERRAR SESIÓN</span>
          </button>
        </div>
      </aside>

      {/* Área principal con header */}
      <div className="md:ml-56 lg:ml-64 flex flex-col min-h-screen">
        {/* Header superior con efecto glass */}
        <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2 w-full shadow-xl overflow-hidden">
          <div className="glass-overlay glass-effect border-b"></div>
          
          {/* Fila superior: Título y acciones */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              {/* Botón menú hamburguesa para móvil */}
              <button
                className="md:hidden text-white p-2 flex flex-col justify-center items-center gap-1.5"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="block w-6 h-0.5 bg-white transition-all"></span>
                <span className="block w-6 h-0.5 bg-white transition-all"></span>
                <span className="block w-6 h-0.5 bg-white transition-all"></span>
              </button>
              <h1 className="font-black text-lg text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Campana de notificaciones */}
              <button className="relative p-2 text-white hover:text-vender-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
              </button>

              {/* Botón de cerrar sesión */}
              <button
                onClick={handleSignOut}
                className="p-2 text-white hover:text-vender-gold transition-colors rounded-lg hover:bg-white/5"
                aria-label="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Historias en el header */}
          <div className="relative z-10 w-full overflow-hidden">
            <Historias />
          </div>
        </header>

        {/* Contenido principal del dashboard */}
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
    </div>
      </HistoriasProvider>
    </CampanasProvider>
  );
}
