/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          heading: ['var(--font-poppins)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          poppins: ['var(--font-poppins)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        animation: {
          'wave-pulse': 'wave-pulse 4s ease-in-out infinite',
        },
        keyframes: {
          'wave-pulse': {
            '0%, 100%': { opacity: 0.4 },
            '50%': { opacity: 0.7 },
          },
        },
      },
    },
  }