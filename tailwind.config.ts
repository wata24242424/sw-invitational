import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        golf: {
          green: '#1E8E3E',
          dark: '#0B3D2E'
        }
      }
    }
  },
  plugins: []
} satisfies Config
