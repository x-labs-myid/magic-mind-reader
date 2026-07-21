/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{css,xml,html,vue,svelte,ts,tsx}'],
  darkMode: ['class', '.ns-dark'],
  theme: {
    extend: {
      colors: {
        magicBg: '#1e1b4b', // Indigo-950
        magicPurple: '#6366f1', // Indigo-500
        magicPink: '#ec4899', // Pink-500
        magicYellow: '#f59e0b', // Amber-500
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('tailwindcss/plugin')(function ({ addVariant }) {
      addVariant('android', '.ns-android &');
      addVariant('ios', '.ns-ios &');
    }),
  ],
};
