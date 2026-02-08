/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
        body: [
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
      },
      colors: {
        ink: "#0b1220",
        slate: "#111827",
        cloud: "#f8fafc",
        accent: "#0ea5e9",
        accentDark: "#0284c7",
        ring: "rgba(14,165,233,0.35)",
      },
      boxShadow: {
        soft: "0 20px 60px -25px rgba(2,132,199,0.45)",
      },
    },
  },
  plugins: [],
};
