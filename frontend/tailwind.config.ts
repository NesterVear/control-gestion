import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const config : Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes:{
        dark: {
          colors: { 
            background: '#1F2937',
            foreground:  '#FFFFFF',
            primary: {
              DEFAULT: '#3B82F6',
              foreground: 'FFFFFF',
            },
          },
        },
      },
    }),
  ],
};
export default config 