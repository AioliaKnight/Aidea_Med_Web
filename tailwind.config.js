/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "#f05a64",
          dark: "#cc1f2a"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          primary: '#e62733',
          primaryDark: '#cc1f2a',
          secondary: '#111111',
          light: '#FFFFFF',
          gray: '#F8FAFC',
          grayDark: '#E5E7EB',
          textDark: '#1F2937',
          textLight: '#4B5563',
          accent: '#FEF2F2',
        },
        red: {
          DEFAULT: '#e62733',
          light: '#ff3b45',
          dark: '#cc1f2a',
        },
        black: {
          DEFAULT: '#111111',
          light: '#333333',
          dark: '#000000',
        },
        white: {
          DEFAULT: '#ffffff',
          off: '#f5f5f5',
        },
        gray: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#cccccc',
          400: '#aaaaaa',
          500: '#808080',
          600: '#666666',
          700: '#444444',
          800: '#222222',
          900: '#111111',
        },
      },
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        none: "0",
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'primary-sm': '0 1px 2px 0 rgba(230, 39, 51, 0.05)',
        'primary': '0 4px 6px -1px rgba(230, 39, 51, 0.1), 0 2px 4px -1px rgba(230, 39, 51, 0.06)',
        'primary-lg': '0 10px 15px -3px rgba(230, 39, 51, 0.1), 0 4px 6px -2px rgba(230, 39, 51, 0.05)',
        'flat': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'flat-primary': '0 1px 3px rgba(230, 39, 51, 0.1)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-primary': 'inset 0 2px 4px 0 rgba(230, 39, 51, 0.06)',
        'none': 'none',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pulse-primary': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'pulse-primary': 'pulse-primary 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-up': 'scale-up 0.4s ease-out',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #e62733, #cc1f2a)',
        'gradient-dark': 'linear-gradient(to right, #111111, #222222)',
        'dot-pattern': 'url("/images/pattern-dot.png")',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.black.DEFAULT'),
            a: {
              color: theme('colors.red.DEFAULT'),
              '&:hover': {
                color: theme('colors.red.dark'),
              },
            },
            h1: {
              color: theme('colors.black.DEFAULT'),
            },
            h2: {
              color: theme('colors.black.DEFAULT'),
            },
            h3: {
              color: theme('colors.black.DEFAULT'),
            },
            h4: {
              color: theme('colors.black.DEFAULT'),
            },
            h5: {
              color: theme('colors.black.DEFAULT'),
            },
            h6: {
              color: theme('colors.black.DEFAULT'),
            },
            strong: {
              color: theme('colors.black.DEFAULT'),
            },
            code: {
              color: theme('colors.black.DEFAULT'),
            },
            blockquote: {
              borderLeftColor: theme('colors.red.DEFAULT'),
              color: theme('colors.black.light'),
            },
          },
        },
      }),
      transitionTimingFunction: {
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 