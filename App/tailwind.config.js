// tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        transitionProperty: {
          'all': 'all',
        },
        transitionTimingFunction: {
          'signal-ease': 'cubic-bezier(.17,.67,.42,1.3)',
        }
      },
    },
    plugins: [],
  }