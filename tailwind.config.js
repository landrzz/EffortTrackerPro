/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6B4BFF',
        secondary: '#2DD4BF',
        darkNavy: '#1F2937',
        bgGray: '#F9FAFB',
        accentPurple: '#8B5CF6',
        // Dark mode specific colors
        dark: {
          bg: '#111827', // Darker background
          card: '#1F2937', // Card background
          border: '#374151', // Border color
          text: {
            primary: '#F9FAFB', // Primary text
            secondary: '#D1D5DB', // Secondary text
            muted: '#9CA3AF', // Muted text
          },
          accent: {
            purple: '#A78BFA', // Lighter purple for dark mode
            green: '#34D399', // Lighter green for dark mode
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}