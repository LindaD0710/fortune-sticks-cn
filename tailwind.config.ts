import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zen-black': '#1a1a1a',
        'zen-gray': '#2d2d2d',
        'zen-light': '#f5f5f0',
        'zen-gold': '#d4af37',
        'zen-red': '#8b2635',
        'mystic-purple': '#6b21a8',
        'mystic-purple-light': '#9333ea',
        'mystic-purple-dark': '#4c1d95',
        'mystic-purple-glow': '#a855f7',
        'mystic-indigo': '#4f46e5',
        'mystic-violet': '#7c3aed',
      },
      fontFamily: {
        'zen': ['var(--font-zen)', 'serif'],
        'sans': ['var(--font-sans)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'ink-spread': 'inkSpread 1.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        inkSpread: {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
