/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          green: '#558B2F',
          'green-dark': '#33691E',
          'green-light': '#8BC34A',
          'green-pale': '#F1F8E9',
          'green-50': '#f1f8e9',
          'green-100': '#dcedc8',
          'green-200': '#c5e1a5',
          'green-300': '#aed581',
          'green-400': '#9ccc65',
          'green-500': '#8bc34a',
          'green-600': '#7cb342',
          'green-700': '#689f38',
          'green-800': '#558b2f',
          'green-900': '#33691e',
        },
        bear: {
          brown: '#795548',
          'brown-light': '#a1887f',
          'brown-dark': '#4e342e',
          gold: '#FFB300',
          'gold-light': '#FFD54F',
        },
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            a: {
              color: '#558B2F',
              '&:hover': {
                color: '#33691E',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
};
