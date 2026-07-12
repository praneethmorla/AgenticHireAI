export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./features/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(214 22% 88%)",
        background: "hsl(210 20% 98%)",
        foreground: "hsl(222 28% 14%)",
        primary: "hsl(201 89% 36%)",
        accent: "hsl(34 92% 50%)",
        success: "hsl(145 63% 35%)",
        danger: "hsl(358 72% 48%)"
      }
    }
  },
  plugins: []
};
