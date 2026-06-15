/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#0F5132",
        leaf: "#20A36B",
        skysoft: "#EAF7F3",
        ink: "#172026"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(15, 81, 50, 0.12)"
      }
    }
  },
  plugins: []
};
