/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tiktok: {
          dark: '#121212',
          light: '#ffffff',
          pink: '#FE2C55',
          cyan: '#20D5EC',
          gray: 'rgba(22, 24, 35, 0.6)',
        }
      },
      fontFamily: {
        sans: ['Sofia Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}