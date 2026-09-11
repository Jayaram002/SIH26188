/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card': 'var(--bg-card)',
        'bg-card-hover': 'var(--bg-card-hover)',
        'border-primary': 'var(--border-primary)',
        'border-accent': 'var(--border-accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'verified': 'var(--verified)',
        'verified-dark': '#007a32',
        'review': 'var(--review)',
        'review-dark': '#7a5500',
        'highrisk': 'var(--highrisk)',
        'highrisk-dark': '#7a1c1a',
        'info': 'var(--info)',
        // Aviation shades
        aviation: {
          950: '#03060f', 900: '#060d1f', 800: '#0a1628',
          700: '#0d1f3c', 600: '#122850', 500: '#1a3a6e',
          400: '#2352a0', 300: '#3b6ec4', 200: '#6090d8',
          100: '#93b7eb', 50: '#d4e4f7',
        },
        panel: { bg: '#080f1e', border: '#1a2a45', card: '#0d1a2d', hover: '#122240' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.4s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        scanLine: { '0%, 100%': { transform: 'translateY(0%)' }, '50%': { transform: 'translateY(100%)' } },
        glow: { from: { boxShadow: '0 0 5px rgba(35,82,160,0.4)' }, to: { boxShadow: '0 0 20px rgba(35,82,160,0.8)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
      backdropBlur: { xs: '2px' }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
