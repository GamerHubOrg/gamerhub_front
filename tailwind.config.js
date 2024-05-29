/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '2000px'
      },
      colors: {
        'primary': 'rgba(0, 165, 105, 1)',
        'secondary': 'rgba(255, 255, 255, 0.2)',
        'lightgrey': 'rgba(30, 30, 30, 1)',
      }
    },
  },
  plugins: [],
}

