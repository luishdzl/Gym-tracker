/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    "./public/**/*.html",  // Incluye todos los archivos HTML en la carpeta public
  "./src/**/*.{js,jsx,ts,tsx}", // Incluye archivos de componentes (si usas frameworks como React)
], // Ubicación de tus archivos HTML y JS
  theme: {
    extend: {},
  },
  plugins: [],
};
