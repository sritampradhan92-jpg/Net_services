/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#edf9ff",
          100: "#d6f0ff",
          200: "#ade1ff",
          300: "#7cd0ff",
          400: "#44bbf2",
          500: "#1ca7e1",
          600: "#148ec8",
          700: "#0f6fa6",
          800: "#0f4f84",
          900: "#113a6a",
        },
        gray: {
          50: "#f3f8fc",
          100: "#e6f0f8",
          200: "#c9dded",
          300: "#a4c3dc",
          400: "#6d92b8",
          500: "#4f769d",
          600: "#365d84",
          700: "#234a74",
          800: "#123a66",
          900: "#0b2f58",
        },
      },
    },
  },
  plugins: [],
};
