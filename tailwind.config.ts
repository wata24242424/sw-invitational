// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#F0EBE3',
        base: { light: '#E4DCCF', dark: '#7D9D9C' },
        accent: '#576F72',
      },
    },
  },
  plugins: [],
} satisfies Config;
