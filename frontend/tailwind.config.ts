import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const config : Config = {
  content: [
'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui({
    themes: {
        dark: {
            colors: {
                background: '#1F2937',
                foreground: '#FFFFFF',
                primary: {
                    DEFAULT: '#3B82F6',
                    foreground: 'FFFFFF',
                },
            },
        },
    },
  })],
}
export default config 
