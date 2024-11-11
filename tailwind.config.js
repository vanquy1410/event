/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-500': 'var(--primary-500)',
        'primary-50': 'var(--primary-50)',
        'secondary-500': 'var(--secondary-500)',
        grey: {
          50: '#F9FAFB',
          500: '#6B7280'
        }
      },
      backgroundColor: {
        dark: 'var(--dark-bg)',
        light: 'var(--light-bg)'
      },
      textColor: {
        dark: 'var(--dark-text)',
        light: 'var(--light-text)'
      }
    }
  },
  plugins: []
}; 