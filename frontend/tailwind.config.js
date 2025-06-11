/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  darkMode: 'class', // 👈 IMPORTANTE para permitir cambiar tema vía clase .dark
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
        heading: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'limpio-gold': {
          DEFAULT: '#daa520',
          dark: '#b8860b',
        },
        'limpio-dark': '#1f2937',
        'limpio-light': '#f9fafb',
        'limpio-gray': '#6b7280',
      }
    },
  },
  plugins: [],
}
