/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff00ff',
        },
        secondary: {
          DEFAULT: '#00ffff',
        },
        accent: {
          DEFAULT: '#ffff00',
        },
      },
      boxShadow: {
        'neon-primary': '0 0 10px #ff00ff',
        'neon-secondary': '0 0 10px #00ffff',
        'neon-accent': '0 0 10px #ffff00',
      },
    },
  },
  plugins: [],
} 