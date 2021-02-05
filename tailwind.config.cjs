/** https://tailwindcss.com/docs/configuration */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './pages/**/*.njk'
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'small': '640px',
        'medium': '1024px',
        'large': '1280px'
      },
      colors: {
        'rose': colors.rose
      }
    },
  },
  variants: {
    extend: {
      textColor: ['active'],
      backgroundColor: ['active']
    },
  },
  plugins: [
    plugin(function({ addUtilities, addComponents, theme }) {
      const utilities = {
        '.txtor-mixed': {
          'text-orientation': 'mixed'
        },
        '.txtor-upright': {
          'text-orientation': 'upright'
        },
        '.txtor-sideways': {
          'text-orientation': 'sideways'
        }
      }
      const subtitles = {
        '.subtitle': {
          fontWeight: theme('fontWeight.900'),
          textDecoration: 'line-through',
          '&:hover': {
            letterSpacing: theme('letterSpacing.widest')
          }
        },
        '.subtitle-gr': {
          backgroundColor: theme('colors.green.200'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.green.900')
          }
        }
      }
      addUtilities(utilities, ['responsive']);
      addComponents(subtitles);
    })
  ],
}
