import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-100': '#d4eaf7',
        'primary-200': '#b6ccd8',
        'primary-300': '#3b3c3d',
        'accent-100': '#71c4ef',
        'accent-200': '#00668c',
        'text-100': '#1d1c1c',
        'text-200': '#313d44',
        'bg-100': '#fffefb',
        'bg-200': '#f5f4f1',
        'bg-300': '#cccbc8',
      },
    },
  },
  plugins: [],
};
export default config;
