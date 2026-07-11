/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(152 45% 30%)",
        "primary-foreground": "hsl(0 0% 100%)",
        secondary: "hsl(188 65% 34%)",
        "secondary-foreground": "hsl(0 0% 100%)",
        wood: "hsl(28 45% 42%)",
        accent: "hsl(32 35% 90%)",
        background: "hsl(38 32% 93%)",
        foreground: "hsl(150 15% 15%)",
        card: "hsl(0 0% 100%)",
        muted: "hsl(40 15% 94%)",
        "muted-foreground": "hsl(150 8% 45%)",
        border: "hsl(40 15% 88%)",
        destructive: "hsl(4 62% 46%)",
        success: "hsl(142 50% 36%)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
