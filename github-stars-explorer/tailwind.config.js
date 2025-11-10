/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          900: '#312E81',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          500: '#A3A3A3',
          700: '#404040',
          900: '#171717',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        // Dark mode specific colors
        dark: {
          bg: {
            page: '#0A0A0A',
            surface: '#171717',
            elevated: '#262626',
          },
          neutral: {
            50: '#0A0A0A',
            100: '#171717',
            200: '#262626',
            500: '#737373',
            700: '#D4D4D4',
            900: '#FAFAFA',
          },
          primary: {
            400: '#818CF8',
            500: '#6366F1',
            600: '#4F46E5',
            700: '#4338CA',
            900: '#E0E7FF',
            '900/20': 'rgba(224, 231, 255, 0.2)',
          },
          semantic: {
            success: '#34D399',
            warning: '#FBBF24',
            error: '#F87171',
            info: '#60A5FA',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
