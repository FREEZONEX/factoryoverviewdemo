/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-lime': '#B2ED1D',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}


