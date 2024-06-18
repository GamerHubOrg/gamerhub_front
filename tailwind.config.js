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
        'primary': '#00a569',
        'secondary': 'rgba(255, 255, 255, 0.2)',
        'lightgrey': 'rgba(30, 30, 30, 1)',
        'dark1': '#121212',
        'dark2': '#1E1E1E',
        'dark3': '#232323',
        'dark5': '#272727',
      }
    },
  },
  plugins: [],
}

