/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          gray: {
            900: '#0a0a0a',
            800: '#1f1f1f',
            700: '#2d2d2d',
            600: '#3d3d3d',
          },
        },
      },
    },
    plugins: [],
  }