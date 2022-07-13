/** https://tailwindcss.com/docs/configuration */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit', 
  purge: {
    content: [
      './pages/**/*.njk',
      './pages/**/*.json',
      './pages/**/*.js',
      './tailwind-class-safelist.txt' 
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        /* TODO: add webp and jpg fallback URLs */
        // 'pattern--ams-grey': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%'><defs><pattern id='ameswellPattern' x='0' y='0' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%23c2b8ab;'/></pattern><rect id='block' x='-100%' y='0' width='200%' height='214%' transform='scale(0.5)' fill='url(%23ameswellPattern)' /></defs><use xlink:href='%23block' x='50%' y='0'/></svg>\")",
        // 'pattern--ams-taupe': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%'><defs><pattern id='ameswellPattern' x='0' y='0' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%23686058;'/></pattern><rect id='block' x='-100%' y='0' width='200%' height='214%' transform='scale(0.5)' fill='url(%23ameswellPattern)' /></defs><use xlink:href='%23block' x='50%' y='0'/></svg>\")",
        // 'pattern--ams-green': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%'><defs><pattern id='ameswellPattern' x='0' y='0' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%2300a651;'/></pattern><rect id='block' x='-100%' y='0' width='200%' height='214%' transform='scale(0.5)' fill='url(%23ameswellPattern)' /></defs><use xlink:href='%23block' x='50%' y='0'/></svg>\")",
        // 'pattern--ams-gold': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%'><defs><pattern id='ameswellPattern' x='0' y='0' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%23857550;'/></pattern><rect id='block' x='-100%' y='0' width='200%' height='214%' transform='scale(0.5)' fill='url(%23ameswellPattern)' /></defs><use xlink:href='%23block' x='50%' y='0'/></svg>\")",
        // 'pattern--ams-yellow': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%'><defs><pattern id='ameswellPattern' x='0' y='0' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%23f6e948;'/></pattern><rect id='block' x='-100%' y='0' width='200%' height='214%' transform='scale(0.5)' fill='url(%23ameswellPattern)' /></defs><use xlink:href='%23block' x='50%' y='0'/></svg>\")",
        // 'pattern--ams-orange': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%'><defs><pattern id='ameswellPattern' x='0' y='0' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%23f7941e;'/></pattern><rect id='block' x='-100%' y='0' width='200%' height='214%' transform='scale(0.5)' fill='url(%23ameswellPattern)' /></defs><use xlink:href='%23block' x='50%' y='0'/></svg>\")",
        // 'pattern--ams-magenta': "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='100%'><defs><pattern id='ameswellPattern' x='0' y='0' width='160' height='160' patternUnits='userSpaceOnUse'><path d='M1,1,80.5,80.5M1,1H40.75M1,1V80.5M1,1,80.5,160M160,1H120.25M160,1,1,160M160,1V80.5M160,1,80.5,160m79.5,0L80.5,80.5M160,160,80.5,1M160,160V80.5m0,79.5H120.25M1,160V80.5M1,160,80.5,1M1,160H40.75M80.5,80.5,120.25,1M80.5,80.5,40.75,1M80.5,80.5,120.25,160M80.5,80.5,40.75,160M120.25,1H80.5m39.75,0L160,80.5M40.75,1,1,80.5M40.75,1H80.5M1,80.5,40.75,160M160,80.5,120.25,160M80.5,160h39.75M80.5,160H40.75' style='stroke:%23ec008c;'/></pattern><rect id='block' x='-100%' y='0' width='200%' height='214%' transform='scale(0.5)' fill='url(%23ameswellPattern)' /></defs><use xlink:href='%23block' x='50%' y='0'/></svg>\")"        
      },
      backgroundPosition: {
        'center-right': 'center right',
        'inherit': 'inherit',
      },
      screens: {
        'small': '640px',
        'xmed': '900px',
        'medium': '1024px',
        'large': '1280px'
      },
      height: {
        '170':'42.5rem',
        '800': '50rem',
        '184':'46rem',
        '136':'34rem'
      },
      minWidth: {
       '2xs': '14rem'
      },
      maxWidth: {
        "ameswel":"1440px"
      },
      minHeight: {
       'l': '8rem',
       '2':'14rem'
      },
      borderWidth: {
        '3': '3px'
      },
      spacing: {
          'fab-container-sm': '8.5rem',
         'fab-container-lg': '12.2rem',
         'fab-width-sm': '116px',
         'fab-height-sm': '108px',
         'fab-width-lg': '176px',
         'fab-height-lg': '163px',
         'carousel-lg': '26.5rem',
         '30':'7.5rem'
       },
      colors: {
        'rose': colors.rose,
        'ams-primary': '#213e4c',
        'ams-taupe': '#686058',
        'ams-grey': '#c2b8ab',
        'ams-gold': '#857550',
        'ams-sand': '#DBC8B6',
        'ams-cyan': '#00aeef',
        'ams-green': '#00a651',
        'ams-orange': '#f7941e',
        'ams-magenta': '#ec008c',
        'ams-yellow': '#f6e948',
        'ams-white': '#fff',
        'ams-base': '#f6f4f2',
        'ams-label': '#f4f4f4',
        'ams-pink':'#D73288',
        'ams-main-1':'#4F2A30',
        'ams-main-2':'#01499B',
        'ams-main-3':'#311686',
        'ams-main-4':'#65ACC8',
        'ams-main-5':'#435F8D',
        'ams-main-6':'#010203',
        'ams-main-7':'#6095B4',
        'ams-main-8':'#701C13',
        'ams-main-9':'#3C291B',
        'ams-main-10':'#4E579C',
        'ams-main-11':'#85434B',
        'ams-main-12':'#E2DFD3',
        'ams-main-13':'#313C2B',
        'ams-main-14':'#FED9DA',
        'ams-black':'#000000',
        'ams-main-15':'#B0A79E',
        'ams-main-16':'#DFDAD7',
        'ams-main-17':'#5A4F4D',
        'ams-main-18':'#082343',
        'ams-main-21':'#C59494'
      },
      placeholderColor: theme => theme('colors'),
      fontFamily: {
        sans: ['Mark Pro', 'sans-serif'],
        serif: ['Eksell Display Small', 'serif'],
        'serif-display': ['Eksell Display Large', 'serif']
      },
      fontSize:{
        '2.5xl': ['28px', '34px'],
      },
      gridTemplateRows: {
        'hero-home': '400px auto',
        'happenings-home': '230px auto',
        'home-hero': '0px auto',
        'slideshow': 'repeat(3, auto)',
        'footer': 'repeat(3, auto)'
      },
      gridTemplateColumns: {
        '50-50': '1fr 1fr',
        'sm-main-sm': '20% auto 20%',
        '40-60': '2fr 3fr',
        '60-40': '3fr 2fr',
        '35-65':'35% 65%',
        'minmax-35-65':'minmax(0, 35%) minmax(0, 65%)',
        'minmax-65-35':'minmax(0, 65%) minmax(0, 35%)',
        'auto-600': 'auto 600px',
        'slideshow': '55% 45%',
        'sm-auto': 'auto 1fr',
        'auto-sm': '1fr auto',
        'footer': 'repeat(3, 1fr)',
        'footer-mobile': 'max-content max-content',
        'auto-max': 'auto max-content',
      },
      gridTemplateAreas: {
        'slideshow': ['slide', 'details', 'amenities', 'cta'],
        'slideshow-xmed': ['slide slide', 'amenities cta', 'amenities details'],
        'footer': ['logo hotel contact']
      },
      transitionDuration: {
        '0': '0ms',
        '250': '250ms'
      },
      backgroundColor: {
        'button': '#857550'
      },
      transitionDelay: {
        '0': '0ms',
      },
      rotate: { 
        '-135': '-135deg',
      },
      inset: {
       '-0.5': '-0.125rem',
       'right-2': '0.75rem',
       'top-2': '0.75rem',
       'left-3': '0.75rem',
       'right-3': '0.75rem',
       '-125':"-500px",
       '81': '22.75rem',
       '9999': '50%',
       '17': '17.75rem'
      },
      transitionProperty: {
        'height': 'height'
      },
      margin: {
        '0.8': '.2rem',
        '-0.313': '-0.313rem'
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
      backgroundColor: ['active', 'checked'],
      borderColor: ['checked'],
      borderStyle: ['focus'],
      borderWidth: ['focus']
    },
  },
  plugins: [
    require('@savvywombat/tailwindcss-grid-areas'),
    require('@tailwindcss/forms'),
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
