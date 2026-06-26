/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#1e293b',
          805: '#0f172a',
          850: '#1a2235',
          855: '#131c2e',
          905: '#0b111e',
        },
      },
    },
  },
  plugins: [],
}
