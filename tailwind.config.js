/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#2a1f1a',
        'panel-bg': '#4a3f3a',
        'text-main': '#e5d5b5',
        'text-heading': '#eacda3',
        'rich-gold': '#d4af37',
        'forest-green': '#5a8c5a',
      },
      fontFamily: {
        'medieval': ['MedievalSharp', 'cursive'],
        'lora': ['Lora', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 15px 1px rgba(212, 175, 55, 0.4)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
