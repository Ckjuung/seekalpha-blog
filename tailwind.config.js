/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0D0D0D',
          soft: '#1A1A1A',
          muted: '#2E2E2E',
        },
        paper: {
          DEFAULT: '#F7F5F0',
          warm: '#EEEBE3',
          soft: '#FAF9F6',
        },
        accent: {
          stock: '#1A6B3C',
          realestate: '#8B4513',
          life: '#4A3882',
          gold: '#C9A84C',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#0D0D0D',
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [],
}
