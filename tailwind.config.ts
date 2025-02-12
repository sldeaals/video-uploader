import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
