/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FFD700', // Soft Gold
        },
        green: {
          400: '#39ff14', // Neon Green
        }
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 15px 1px rgba(57, 255, 20, 0.4)',
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
