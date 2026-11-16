import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * Identidade "barbearia clássica": papel quente, grafite e latão.
 * - brass-500 é o destaque para superfícies, bordas e foco; brass-700 é a versão
 *   com contraste suficiente (AA) para texto pequeno sobre o papel.
 */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        charcoal: {
          DEFAULT: '#1C1917',
          800: '#292524',
          700: '#44403C',
        },
        ink: '#292524',
        muted: '#78716C',
        line: '#E7DFD3',
        brass: {
          50: '#FBF5EA',
          100: '#F5E9D3',
          200: '#EBD3A6',
          500: '#B7791F',
          600: '#9E6618',
          700: '#8A5A12',
        },
      },
      fontFamily: {
        sans: ['"Figtree Variable"', ...defaultTheme.fontFamily.sans],
        display: ['"Fraunces Variable"', ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        lift: '0 1px 2px rgb(28 25 23 / 0.06), 0 4px 16px -4px rgb(28 25 23 / 0.08)',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'rise-in': 'rise-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'fade-in': 'fade-in 160ms ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config
