/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme') // Necesitas importar esto

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Definir las familias de fuentes
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans], // Fuente por defecto para cuerpo
        heading: ['Poppins', ...defaultTheme.fontFamily.sans], // Fuente para títulos
      },
      // Definir colores personalizados (puedes ajustar los tonos exactos)
      colors: {
        'limpio-gold': {
          DEFAULT: '#daa520', // Un dorado estándar, puedes usar amber-500/600 de Tailwind también
          dark: '#b8860b',  // Un tono más oscuro para hover/bordes si es necesario
        },
        'limpio-dark': '#1f2937', // Equivalente a gray-800 o 900
        'limpio-light': '#f9fafb', // Equivalente a gray-50
        'limpio-gray': '#6b7280', // Equivalente a gray-500
      }
    },
  },
  plugins: [],
}