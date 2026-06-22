/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        titan: {
          black: '#050505',
          dark: '#0c0c0c',
          card: '#121212',
          red: '#ff003c',
          'red-hover': '#d60032',
          orange: '#ff4d00',
          muted: '#777777',
          secondary: '#bbbbbb',
        },
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #ff003c 0%, #ff4d00 100%)',
        'hero-gradient': 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95))',
      },
      boxShadow: {
        glow: '0 0 25px rgba(255, 0, 60, 0.35)',
        'glow-lg': '0 0 40px rgba(255, 0, 60, 0.5)',
        card: '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 60, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(255, 0, 60, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
