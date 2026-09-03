/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: 'rgb(var(--color-slate-50) / <alpha-value>)',
          100: 'rgb(var(--color-slate-100) / <alpha-value>)',
          200: 'rgb(var(--color-slate-200) / <alpha-value>)',
          300: 'rgb(var(--color-slate-300) / <alpha-value>)',
          400: 'rgb(var(--color-slate-400) / <alpha-value>)',
          500: 'rgb(var(--color-slate-500) / <alpha-value>)',
          600: 'rgb(var(--color-slate-600) / <alpha-value>)',
          700: 'rgb(var(--color-slate-700) / <alpha-value>)',
          800: 'rgb(var(--color-slate-800) / <alpha-value>)',
          900: 'rgb(var(--color-slate-900) / <alpha-value>)',
          950: 'rgb(var(--color-slate-950) / <alpha-value>)',
        },
        tactical: {
          bg: 'rgb(var(--color-tactical-bg) / <alpha-value>)',
          surface: 'rgb(var(--color-tactical-surface) / <alpha-value>)',
          panel: 'rgb(var(--color-tactical-panel) / <alpha-value>)',
          card: 'rgb(var(--color-tactical-card) / <alpha-value>)',
          border: 'rgb(var(--color-tactical-border) / <alpha-value>)',
          accent: '#06b6d4',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          red: '#ef4444',
          orange: '#f97316',
          amber: '#eab308',
          emerald: '#10b981',
          muted: 'rgb(var(--color-tactical-muted) / <alpha-value>)',
          text: 'rgb(var(--color-tactical-text) / <alpha-value>)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.35)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.35)',
        'glow-amber': '0 0 20px rgba(234, 179, 8, 0.35)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'radar-sweep': 'sweep 4s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
