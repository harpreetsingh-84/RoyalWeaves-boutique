/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "rgb(var(--color-dark-bg) / <alpha-value>)",
        lightText: "rgb(var(--color-light-text) / <alpha-value>)",
        primaryAction: "rgb(var(--color-primary-action) / <alpha-value>)",
        secondaryAction: "rgb(var(--color-secondary-action) / <alpha-value>)",
        highlight: "rgb(var(--color-highlight) / <alpha-value>)",
        navyHighlight: "rgb(var(--color-navy-highlight) / <alpha-value>)",
        accentRed: "rgb(var(--color-accent-red) / <alpha-value>)",
        
        // Admin Colors
        adminBg: "rgb(var(--color-admin-bg) / <alpha-value>)",
        adminCard: "rgb(var(--color-admin-card) / <alpha-value>)",
        adminCardAlt: "rgb(var(--color-admin-card-alt) / <alpha-value>)",
        adminBorder: "rgb(var(--color-admin-border) / <alpha-value>)",
        adminBorderLight: "rgb(var(--color-admin-border-light) / <alpha-value>)",
        adminBorderLighter: "rgb(var(--color-admin-border-lighter) / <alpha-value>)",
        adminTextMuted: "rgb(var(--color-admin-text-muted) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite linear',
        'bounce-soft': 'bounceSoft 2s infinite ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
