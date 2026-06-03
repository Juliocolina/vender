"use client";
import { useState } from "react";
import Link from 'next/link';
import { Logo } from "./Logo";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 bg-vender-blue sticky top-0 z-50 shadow-xl h-20 w-full">
      
      {/* LEY 1: EL LOGO INTEGRADO COMO MARCA (Escritorio/Navbar principal) */}
      <Link href="/" className="flex items-center h-10 group shrink-0">
        <Logo className="text-white group-hover:text-vender-gold transition-colors" />
      </Link>

      {/* EL MENÚ HORIZONTAL (Solo visible en computadoras - md:flex) */}
      <div className="hidden md:flex items-center space-x-8 text-[11px] font-black tracking-[0.2em] uppercase mx-auto">
        <a href="#solucion" className="text-white hover:text-vender-gold transition-colors">Solución</a>
        <a href="#contacto" className="text-white hover:text-vender-gold transition-colors">Contacto</a>
      </div>

      {/* BOTONES DE ACCIÓN DERECHOS */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* DASHBOARD (Visible en escritorios) */}
        <Link href="/login" className="hidden md:flex text-vender-gold text-[11px] font-black tracking-[0.2em] uppercase hover:text-white transition-colors">
          Dashboard
        </Link>
        
        {/* BOTÓN DE ACCIÓN PRIORITARIO */}
        <button className="bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-black py-2.5 px-6 rounded-xl text-[10px] tracking-widest transition-all shadow-lg active:scale-95 uppercase">
          Empezar
        </button>

        {/* MENÚ HAMBURGUESA (Solo en móviles - md:hidden) */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 focus:outline-none flex flex-col justify-center items-center gap-1.5 z-50 md:hidden">
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* PANEL LATERAL (Corregido: Ahora incluye el Logo SVG arriba) */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-vender-dark shadow-2xl transform transition-transform duration-300 z-50 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 pt-10 flex flex-col gap-8">
          
          {/* Cabecera del menú lateral: Logo de la empresa y botón de cerrar */}
          <div className="flex justify-between items-center border-b border-white/10 pb-6">
            <div className="h-8">
              <Logo className="text-white" />
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white text-2xl hover:text-vender-gold transition-colors">&times;</button>
          </div>
          
          {/* Enlaces del menú */}
          <div className="flex flex-col gap-6 text-gray-300 font-bold uppercase text-xs tracking-[0.2em]">
            <Link href="#solucion" onClick={() => setIsOpen(false)} className="hover:text-vender-gold transition">Solución</Link>
            <Link href="#contacto" onClick={() => setIsOpen(false)} className="hover:text-vender-gold transition">Contacto</Link>
            <hr className="border-white/10" />
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-vender-gold flex items-center gap-2 mt-2">
              <span className="text-lg">👤</span> Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Fondo oscuro inflable para cerrar */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
    </nav>
  );
};