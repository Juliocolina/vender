import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <svg 
      viewBox="0 0 420 120" 
      className={`h-full w-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Cuadro Dorado con bordes suaves */}
      <rect x="10" y="10" width="100" height="100" rx="28" fill="#d4af37" />
      
      {/* 2. Isotipo: La V Geométrica con la flecha hacia arriba */}
      <path 
        d="M32 45 L52 80 L75 35 M75 35 L62 38 M75 35 L72 48" 
        stroke="#002147" 
        strokeWidth="11" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      
      {/* 3. Palabra VENDER (Opcional mediante propiedad, por defecto activa) */}
      {showText && (
        <text 
          x="140" 
          y="78" 
          fill="currentColor" 
          fontWeight="900" 
          fontSize="54" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          letterSpacing="-0.03em"
        >
          VENDER
        </text>
      )}
    </svg>
  );
};