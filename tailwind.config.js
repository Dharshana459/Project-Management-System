/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // Very subtle off-white
        surface: '#FFFFFF',
        sidebar: '#fbfbfb', // Slightly distinguished sidebar
        primary: '#6d28d9', // Brand Purple
        primaryHover: '#5b21b6', 
        secondary: '#059669', // Emerald
        accent: '#f43f5e', // Rose
        textMain: '#18181b', // Zinc 900
        textMuted: '#71717a', // Zinc 500
        textSoft: '#a1a1aa', // Zinc 400
        borderLight: '#e4e4e7', // Zinc 200
        cardHover: '#f4f4f5', // Zinc 100
        warning: '#f59e0b', // Amber 500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'modal': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'dotted': 'radial-gradient(#e4e4e7 1.5px, transparent 1.5px)',
      }
    },
  },
  plugins: [],
}
