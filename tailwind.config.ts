// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Убрали 'src/' из пути
  ],
  theme: {
    extend: {
      // Добавляем наши кастомные шрифты
      fontFamily: {
        sans: ['var(--font-inter)'], // Это будет шрифт по умолчанию
        karantina: ['var(--font-karantina)'],
        'istok-web': ['var(--font-istok-web)'],
        'source-serif-pro': ['var(--font-source-serif-pro)'],
      },
    },
  },
  plugins: [],
};
export default config;
