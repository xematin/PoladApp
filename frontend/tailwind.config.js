/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#080C14',
        'bg-surface': '#0F1824',
        'bg-hero': '#0D1A2D',
        'bg-input': '#080C14',
        steel: '#C8CDD6',
        'glow-blue': '#2A7FFF',
        'light-blue': '#5BA4FF',
        muted: '#6B7A8D',
        'inactive-el': '#2a3a4a',
        'border-dark': '#1a2535',
        'border-hero': '#1e3050',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
