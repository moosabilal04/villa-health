/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F2B27",
        clinic: {
          50: "#F4F8F6",
          100: "#E3EEE9",
          200: "#C3DBD1",
          300: "#96BFAE",
          400: "#5E9683",
          500: "#3D7863",
          600: "#2C5E4D",
          700: "#234B3E",
          800: "#1B3B31",
          900: "#132A23",
        },
        clay: "#C97D5C",
        sand: "#F7F3EC",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
