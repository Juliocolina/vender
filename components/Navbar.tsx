export const Navbar = () => {

return (

<nav className="flex items-center justify-between px-8 py-4 bg-[#002147] sticky top-0 z-50 shadow-xl">

<div className="flex items-center gap-3">

{/* LOGO SVG RECREADO */}

<div className="relative w-10 h-10 flex items-center justify-center">

<svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">

{/* La V de fondo */}

<path d="M20 30L50 85L80 30" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>

{/* El Carrito simplificado */}

<path d="M40 45H60L58 55H42L40 45Z" fill="white" />

<circle cx="45" cy="60" r="3" fill="white" />

<circle cx="55" cy="60" r="3" fill="white" />

{/* Flecha de Crecimiento */}

<path d="M65 45L85 20M85 20H75M85 20V30" stroke="#d4af37" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>

{/* Estrella de Éxito */}

<path d="M85 45L87 50H92L88 53L89 58L85 55L81 58L82 53L78 50H83L85 45Z" fill="#d4af37" />

</svg>

</div>


<div className="flex flex-col">

<span className="text-2xl font-black text-white tracking-tighter leading-none">VENDER</span>

<span className="text-[8px] font-bold text-vender-gold uppercase tracking-[0.2em]">Plataforma de Comercio Digital</span>

</div>

</div>



{/* Menú Desktop */}

<div className="hidden md:flex gap-8 text-xs font-bold text-gray-300 uppercase tracking-widest">

<span className="hover:text-vender-gold cursor-pointer transition">Funciones</span>

<span className="hover:text-vender-gold cursor-pointer transition">Precios</span>

<span className="hover:text-vender-gold cursor-pointer transition">Soporte</span>

</div>



<div className="flex items-center gap-5">

<button className="text-xs font-bold text-white cursor-pointer hover:text-vender-gold transition">LOGIN</button>

<button className="bg-white hover:bg-vender-gold hover:text-white text-vender-blue font-black py-2 px-6 rounded-sm text-xs transition-all shadow-lg active:scale-95 cursor-pointer">

EMPEZAR AHORA

</button>

</div>

</nav>

);

}; 