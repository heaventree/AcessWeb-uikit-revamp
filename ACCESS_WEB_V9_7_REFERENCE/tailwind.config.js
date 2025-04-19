/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Using CSS variables for colors from theme-variables.css
        primary: {
          50: 'rgb(var(--color-primary-50))',
          100: 'rgb(var(--color-primary-100))', 
          200: 'rgb(var(--color-primary-200))',
          300: 'rgb(var(--color-primary-300))',
          400: 'rgb(var(--color-primary-400))',
          500: 'rgb(var(--color-primary-500))',
          600: 'rgb(var(--color-primary-600))',
          700: 'rgb(var(--color-primary-700))',
          800: 'rgb(var(--color-primary-800))',
          900: 'rgb(var(--color-primary-900))',
          950: 'rgb(var(--color-primary-950))'
        },
        secondary: {
          50: 'rgb(var(--color-secondary-50))',
          100: 'rgb(var(--color-secondary-100))',
          200: 'rgb(var(--color-secondary-200))',
          300: 'rgb(var(--color-secondary-300))',
          400: 'rgb(var(--color-secondary-400))',
          500: 'rgb(var(--color-secondary-500))',
          600: 'rgb(var(--color-secondary-600))',
          700: 'rgb(var(--color-secondary-700))',
          800: 'rgb(var(--color-secondary-800))',
          900: 'rgb(var(--color-secondary-900))',
          950: 'rgb(var(--color-secondary-950))'
        },
        // Using CSS variables for semantic colors
        success: {
          50: 'rgb(var(--color-success-50))',
          100: 'rgb(var(--color-success-100))',
          200: 'rgb(var(--color-success-200))',
          300: 'rgb(var(--color-success-300))',
          400: 'rgb(var(--color-success-400))',
          500: 'rgb(var(--color-success-500))',
          600: 'rgb(var(--color-success-600))',
          700: 'rgb(var(--color-success-700))',
          800: 'rgb(var(--color-success-800))',
          900: 'rgb(var(--color-success-900))',
          950: 'rgb(var(--color-success-950))'
        },
        warning: {
          50: 'rgb(var(--color-warning-50))',
          100: 'rgb(var(--color-warning-100))',
          200: 'rgb(var(--color-warning-200))',
          300: 'rgb(var(--color-warning-300))',
          400: 'rgb(var(--color-warning-400))',
          500: 'rgb(var(--color-warning-500))',
          600: 'rgb(var(--color-warning-600))',
          700: 'rgb(var(--color-warning-700))',
          800: 'rgb(var(--color-warning-800))',
          900: 'rgb(var(--color-warning-900))',
          950: 'rgb(var(--color-warning-950))'
        },
        error: {
          50: 'rgb(var(--color-error-50))',
          100: 'rgb(var(--color-error-100))',
          200: 'rgb(var(--color-error-200))',
          300: 'rgb(var(--color-error-300))',
          400: 'rgb(var(--color-error-400))',
          500: 'rgb(var(--color-error-500))',
          600: 'rgb(var(--color-error-600))',
          700: 'rgb(var(--color-error-700))',
          800: 'rgb(var(--color-error-800))',
          900: 'rgb(var(--color-error-900))',
          950: 'rgb(var(--color-error-950))'
        },
        info: {
          50: 'rgb(var(--color-info-50))',
          100: 'rgb(var(--color-info-100))',
          200: 'rgb(var(--color-info-200))',
          300: 'rgb(var(--color-info-300))',
          400: 'rgb(var(--color-info-400))',
          500: 'rgb(var(--color-info-500))',
          600: 'rgb(var(--color-info-600))',
          700: 'rgb(var(--color-info-700))',
          800: 'rgb(var(--color-info-800))',
          900: 'rgb(var(--color-info-900))',
          950: 'rgb(var(--color-info-950))'
        },
        // Using CSS variables for grays
        gray: {
          50: 'rgb(var(--color-gray-50))',
          100: 'rgb(var(--color-gray-100))',
          200: 'rgb(var(--color-gray-200))',
          300: 'rgb(var(--color-gray-300))',
          400: 'rgb(var(--color-gray-400))',
          500: 'rgb(var(--color-gray-500))',
          600: 'rgb(var(--color-gray-600))',
          700: 'rgb(var(--color-gray-700))',
          800: 'rgb(var(--color-gray-800))',
          900: 'rgb(var(--color-gray-900))',
          950: 'rgb(var(--color-gray-950))'
        },
        // Card background colors (light/dark mode)
        card: {
          bg: 'rgb(var(--card-bg))',
          'bg-secondary': 'rgb(var(--card-bg-secondary))'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      // Enhanced z-index scale based on Noble UI
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070'
      },
      // Enhanced border radius similar to Noble UI
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'card': '0.5rem'
      },
      // Box shadow based on Noble UI
      boxShadow: {
        'card-light': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      },
      // Enhanced typography based on Noble UI design
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h1: {
              fontSize: '2em',
              marginTop: '0',
              marginBottom: '0.8333333em',
              lineHeight: '1.4',
              fontWeight: '800',
              fontFamily: theme('fontFamily.display').join(', '),
            },
            h2: {
              color: theme('colors.primary.800'),
              fontWeight: '700',
              fontFamily: theme('fontFamily.display').join(', '),
              marginTop: '3rem',
              marginBottom: '1.5rem',
            },
            h3: {
              color: theme('colors.secondary.700'),
              fontWeight: '600',
              fontFamily: theme('fontFamily.display').join(', '),
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
            },
            h4: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontFamily: theme('fontFamily.display').join(', '),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: theme('colors.gray.800'),
              backgroundColor: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.md'),
              padding: '0.2em 0.4em',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.lg'),
              padding: theme('spacing.6'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                color: 'inherit',
              },
            },
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.primary.700'),
                textDecoration: 'underline',
              },
            },
            'ul > li': {
              position: 'relative',
              paddingLeft: '1.5em',
              '&::before': {
                content: '""',
                width: '0.5em',
                height: '0.125em',
                position: 'absolute',
                left: 0,
                top: '0.8em',
                backgroundColor: theme('colors.gray.300'),
              },
            },
            'ol > li': {
              paddingLeft: '0.5em',
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.primary.500'),
              backgroundColor: theme('colors.primary.50'),
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '2rem',
              marginBottom: '2rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.primary.300'),
            },
            h3: {
              color: theme('colors.secondary.300'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.800'),
            },
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.500'),
              backgroundColor: theme('colors.primary.900'),
              color: theme('colors.gray.300'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};