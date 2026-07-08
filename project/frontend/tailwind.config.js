/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F23",        // near-black teal — primary background
        deep: "#123238",       // panel background
        teal: "#1F5C5C",       // primary brand
        mist: "#CFE8E3",       // soft text on dark
        amber: "#D98E4A",      // signature accent (the "calm guide" color)
        calm: "#5FB89C",
        concern: "#E0A93E",
        panic: "#D9684B",
        paper: "#F6F3EC",      // light surface for dashboard cards
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
