// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  // ЭТО САМАЯ ВАЖНАЯ ЧАСТЬ!
  // Tailwind должен знать, где искать классы, которые вы используете.
  // Эта конфигурация указывает на папки `app` и `components`
  // и ищет файлы с расширениями js, ts, jsx, tsx, mdx.
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      
      // Здесь вы расширяете стандартную тему Tailwind
      fontFamily: {
        inter: ['var(--font-inter)'],
        karantina: ['var(--font-karantina)'],
        'istok-web': ['var(--font-istok-web)'],
        'source-serif-pro': ['var(--font-source-serif-pro)'],
      },
      // Пример добавления своих цветов (если потребуется)
     colors: {
        background: 'hsl(0 0% 100%)', // Стандартный белый
        foreground: 'hsl(0 0% 3.9%)',   // Стандартный черный
        // Если после этого появятся ошибки на другие классы (например, 'primary', 'secondary'),
        // их нужно будет добавить по аналогии в этот же блок `colors`.
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
