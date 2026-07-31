import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';

/**
 * GSTI Rooklyn-City Neon Design Tokens
 * 6 色板锁死，禁止扩展，任何颜色都从这里派生透明度。
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Neon Palette
        neon: {
          pink: '#FF2D87',
          purple: '#7B61FF',
          cyan: '#00F5FF',
          yellow: '#FFD100',
        },
        night: {
          DEFAULT: '#0A0F1A',
          panel: '#1A1F2E',
        },
        // Semantic aliases
        primary: {
          DEFAULT: '#FF2D87',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#7B61FF',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1A1F2E',
          foreground: '#B8BCC8',
        },
        border: 'rgba(255, 45, 135, 0.2)',
        ring: '#FF2D87',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        tech: ['var(--font-orbitron)', 'sans-serif'],
        data: ['var(--font-rajdhani)', 'sans-serif'],
        sans: ['var(--font-noto-sc)', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 45, 135, 0.6), 0 0 40px rgba(255, 45, 135, 0.3)',
        'neon-purple': '0 0 20px rgba(123, 97, 255, 0.6), 0 0 40px rgba(123, 97, 255, 0.3)',
        'neon-cyan': '0 0 15px rgba(0, 245, 255, 0.5), 0 0 30px rgba(0, 245, 255, 0.25)',
        'neon-yellow': '0 0 15px rgba(255, 209, 0, 0.5)',
        'inset-panel': 'inset 0 0 60px rgba(123, 97, 255, 0.08), inset 0 0 20px rgba(255, 45, 135, 0.05)',
      },
      keyframes: {
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            opacity: '1',
            textShadow:
              '0 0 4px #FF2D87, 0 0 11px #FF2D87, 0 0 19px #FF2D87, 0 0 40px #7B61FF',
          },
          '20%, 24%, 55%': { opacity: '0.4', textShadow: 'none' },
        },
        'scan-lines': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glitch-x': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 1px)' },
          '40%': { transform: 'translate(-1px, -1px)' },
          '60%': { transform: 'translate(2px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 45, 135, 0.6)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 45, 135, 0.9), 0 0 60px rgba(123, 97, 255, 0.4)' },
        },
        'rain-fall': {
          '0%': { transform: 'translateY(-10vh)' },
          '100%': { transform: 'translateY(110vh)' },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'neon-flicker': 'neon-flicker 4s infinite',
        'scan-lines': 'scan-lines 8s linear infinite',
        glitch: 'glitch-x 0.3s infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'rain-fall': 'rain-fall linear infinite',
        'fade-slide-up': 'fade-slide-up 0.6s ease-out forwards',
      },
      backgroundImage: {
        'grid-neon':
          'linear-gradient(rgba(255,45,135,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,135,0.05) 1px, transparent 1px)',
        'radial-city':
          'radial-gradient(ellipse at 50% 80%, rgba(255, 45, 135, 0.25) 0%, rgba(123, 97, 255, 0.15) 30%, transparent 70%)',
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
