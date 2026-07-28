/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        msp: {
          primary: '#123f3b',
          primaryLight: '#1d5751',
          accent: '#d86b45',
          accentDark: '#bc5533',
          background: '#f4f7f6',
          surface: '#ffffff',
          text: '#183330',
          secondary: '#405b57',
          muted: '#687b78',
          border: '#dce7e5',
          softGreen: '#edf4f2',
          softWarm: '#f8f2ed'
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      boxShadow: {
        msp: '0 10px 30px rgba(18, 63, 59, 0.07)',
        'msp-md': '0 14px 40px rgba(18, 63, 59, 0.10)',
        'msp-lg': '0 18px 45px rgba(18, 63, 59, 0.13)'
      }
    }
  },
  plugins: []
}
