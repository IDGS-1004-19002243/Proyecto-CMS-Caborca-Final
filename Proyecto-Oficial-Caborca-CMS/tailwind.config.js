/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Aleo', 'sans-serif'],
        'serif': ['"Patua One"', 'serif'],
        'playfair': ['"Patua One"', 'serif'],
        'patua': ['"Patua One"', 'serif'],
      },
      colors: {
        caborca: {
          cafe: '#9B8674',
          arena: '#D2B48C',
          'beige-suave': '#E8DCC4',
          'beige-medio': '#D4C5A9',
          negro: '#000000',
          bronce: '#B8935F',
          verde: '#34433B',
          azul: '#273E4C',
        },
      },
    },
  },
  plugins: [],
}
