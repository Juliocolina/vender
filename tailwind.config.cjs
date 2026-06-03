module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Forzamos los valores hexadecimales directos para evitar errores de compilación
        'vender-blue': '#002147',
        'vender-gold': '#d4af37',
        'vender-dark': '#00152e',
      }
    }
  },
  plugins: []
};