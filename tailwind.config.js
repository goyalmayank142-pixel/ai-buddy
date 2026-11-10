/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf8f4',
          100: '#f6f0e6',
          200: '#eddccb',
          300: '#dfc2a6',
          400: '#cca17b',
          500: '#b88155',
          600: '#a36d45',
          700: '#865538',
          800: '#6f4531',
          900: '#5c3a2b',
        },
        slatewarm: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e4e7eb',
          300: '#cbd1d8',
          400: '#9aa5b1',
          500: '#687787',
          600: '#485563',
          700: '#333f48',
          800: '#212930',
          900: '#141a1e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
