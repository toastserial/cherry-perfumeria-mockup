/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { cherry: '#D10065', wine: '#681638', blush: '#FFD8D9', rose: '#F99BB6', paper: '#FFFAFB' }, fontFamily: { display: ['Cormorant Garamond', 'serif'], sans: ['Manrope', 'sans-serif'] } } },
  plugins: []
}
