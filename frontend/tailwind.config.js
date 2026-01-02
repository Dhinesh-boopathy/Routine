/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ REQUIRED for dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        confetti: {
          "0%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(100vh) rotate(720deg)",
            opacity: "0",
          },
        },
      },
      animation: {
        confetti: "confetti 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
