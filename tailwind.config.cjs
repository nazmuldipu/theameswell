/** https://tailwindcss.com/docs/configuration */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    './pages/**/*.njk'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        /* TODO: add webp and jpg fallback URLs */
        'hero--home': "url('/images/hero-home.webp')",
        'hero--home-900': "url('/images/hero-home-900.webp')",
        'hero--page-detail': "url('/images/hero-page-detail.jpg')",
        'hero--page-detail-900': "url('/images/hero-page-detail-900.jpg')",
        'segment-pattern--1': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%'><defs><pattern id='ameswellPattern' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%23C2B8AB;'/></pattern></defs><rect width='200%' height='200%' fill='url(%23ameswellPattern)' transform='scale(0.5)'/></svg>\")"
      }),
      screens: {
        'small': '640px',
        'xmed': '900px',
        'medium': '1024px',
        'large': '1280px'
      },
      minWidth: {
       '2xs': '14rem'
      },
      colors: {
        'rose': colors.rose,
        'ams-primary': '#213e4c',
        'ams-taupe': '#686058',
        'ams-grey': '#c2b8ab',
        'ams-gold': '#857550',
        'ams-cyan': '#00aeef',
        'ams-green': '#00a651',
        'ams-orange': '#f7941e',
        'ams-magenta': '#ec008c',
        'ams-yellow': '#f6e948',
        'ams-white': '#fff',
        'ams-base': '#f6f4f2',
        'ams-label': '#f4f4f4'
      },
      placeholderColor: theme => theme('colors'),
      fontFamily: {
        sans: ['Mark Pro', 'sans-serif'],
        serif: ['Eksell Display Small', 'serif']
      },
      gridTemplateRows: {
        'hero-home': '400px auto',
        'slideshow': 'repeat(3, auto)',
        'footer': 'repeat(3, auto)'
      },
      gridTemplateColumns: {
        'sm-main-sm': '20% auto 20%',
        '40-60': '2fr 3fr',
        'slideshow': '55% 45%',
        'footer': 'repeat(3, 1fr)'
      },
      gridTemplateAreas: {
        'slideshow': ['slide', 'details', 'amenities', 'cta'],
        'slideshow-xmed': ['slide slide', 'amenities cta', 'amenities details'],
        'footer': ['logo contact media', 'address legal media', 'credit legal media']
      },
      textIndent: (theme, { negative }) => ({
        ...negative({
          'xl': '9999px'
        }),
      }),
    },
  },
  variants: {
    textIndent: ['responsive'],
    gridTemplateAreas: ['responsive'],
    extend: {
      textColor: ['active'],
      backgroundColor: ['active']
    },
  },
  plugins: [
    require('@savvywombat/tailwindcss-grid-areas'),
    require('tailwindcss-text-indent')(),
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
