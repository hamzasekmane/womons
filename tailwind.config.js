/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF7F2',
          100: '#F7F3EE',
          200: '#EDE6DB',
          300: '#E8DFD3',
          400: '#C5B9A8',
          500: '#A89279',
          600: '#8B7355',
          700: '#6B5A42',
          800: '#5C4D3C',
          900: '#3D3227',
          950: '#2A221B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Times New Roman', 'serif'],
      },
      animation: {
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        float: 'float 20s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': {backgroundPosition: '200% 0'},
          '100%': {backgroundPosition: '-200% 0'},
        },
        float: {
          '0%, 100%': {transform: 'translate(0, 0)'},
          '50%': {transform: 'translate(-2%, -1.5%)'},
        },
      },
    },
  },
  plugins: [],
};