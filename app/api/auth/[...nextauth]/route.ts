// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  // 1. ПРОВАЙДЕРЫ АУТЕНТИФИКАЦИИ
  providers: [
    // Провайдер для Google. Потребует ID и Secret из Google Cloud Console.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Провайдер для кастомной логики (наш SMS-вход)
    CredentialsProvider({
      name: 'SMS',
      // Поля, которые мы ожидаем от фронтенда
      credentials: {
        phone: { label: "Телефон", type: "text" },
        code: { label: "Код", type: "text" },
      },
      // Самая главная функция, которая проверяет данные пользователя
      async authorize(credentials, req) {
        // --- В ЭТОМ БЛОКЕ ВЫ ПРОВЕРЯЕТЕ SMS-КОД ---
        // 1. Вы бы получили телефон и код из `credentials`.
        // 2. Сделали бы запрос к вашему бэкенду или сервису для проверки кода.
        // 3. Если код верный, вы ищете или создаете пользователя в своей БД.
        
        // --- СИМУЛИРУЕМ УСПЕШНУЮ ПРОВЕРКУ ---
        if (credentials?.code === "1234") { // Для теста используем код "1234"
          // Возвращаем объект пользователя. Этот объект будет закодирован в JWT.
          const user = { 
            id: '1', 
            name: 'Роман (из SMS)', 
            email: credentials?.phone 
          };
          return user;
        }
        
        // Если authorize возвращает null, происходит ошибка входа.
        return null;
      }
    })
  ],

  // 2. СТРАТЕГИЯ СЕССИИ
  // Мы используем JWT (JSON Web Tokens) для хранения сессии, без базы данных.
  session: {
    strategy: "jwt",
  },

  // 3. КАСТОМНЫЕ СТРАНИЦЫ
  // Указываем NextAuth, где находится наша кастомная страница входа.
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout', // Можно указать и другие страницы
    // error: '/auth/error', 
  }
});

export { handler as GET, handler as POST }
