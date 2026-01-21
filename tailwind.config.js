/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F172A', // Deep primary for text/headings
          slate: '#64748B', // Secondary text
          blue: '#2563EB', // Trust/Action Blue (Intercom/Stripe style)
          light: '#F8FAFC', // Background wash
          border: '#E2E8F0', // Crisp borders
          // Subtle Aurora Accents
          'aurora-purple': '#E9D5FF', // Purple-200
          'aurora-pink': '#FBCFE8',   // Pink-200
          'aurora-cyan': '#BAE6FD',   // Sky-200
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 10s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
