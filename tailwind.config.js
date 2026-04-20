/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a2332',
        'clio-blue': '#0066cc',
        teal: '#0d9488',
        amber: '#d97706',
        critical: '#dc2626',
        success: '#059669',
        'score-1': '#dc2626',
        'score-2': '#ea580c',
        'score-3': '#ca8a04',
        'score-4': '#2563eb',
        'score-5': '#059669',
        'layer2-bg': '#f0f9ff',
        'layer3-bg': '#faf5ff',
        'cvi-bg': '#f0fdfa',
      },
      fontFamily: {
        serif: ['Source Serif 4', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
