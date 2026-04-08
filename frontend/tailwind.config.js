/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#011627", // Deep Rich Blue Main Background
        lightText: "#fdfffc", // Crisp Off-white Text
        primaryAction: "#e71d36", // Vibrant Red for primary CTAs
        secondaryAction: "#2ec4b6", // Teal for secondary accents and links
        highlight: "#ff9f1c", // Energetic orange for badges/highlights
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
