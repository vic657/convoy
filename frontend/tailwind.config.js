/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        primaryDeep: '#EA580C',
        secondary: '#FACC15',
        textDark: '#1F2937',
        gray100: '#F3F4F6',
        success: '#22C55E',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
}


