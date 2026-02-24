// lib/auth.ts

import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
  // 1. ПРОВАЙДЕРЫ АУТЕНТИФИКАЦИИ
  providers: [
    /**
     * Провайдер для кастомной логики входа по SMS-коду.
     * Мы даем ему уникальный id: 'sms-provider'.
     */
    CredentialsProvider({
      id: 'sms-provider',
      name: 'SMS',
      credentials: {
        name: { label: "Имя", type: "text" },
        phone: { label: "Телефон", type: "text" },
        code: { label: "Код", type: "text" },
      },
      async authorize(credentials) {
        // --- В ЭТОМ БЛОКЕ ВЫ ПРОВЕРЯЕТЕ SMS-КОД ---
        // 1. Вы бы получили телефон и код из `credentials`.
        // 2. Сделали бы запрос к вашему бэкенду или сервису для проверки кода.
        
        // --- СИМУЛИРУЕМ УСПЕШНУЮ ПРОВЕРКУ ---
        // Для теста используем жестко заданный код "1234"
        if (credentials?.code === "1234" && credentials.phone && credentials.name) {
          // Возвращаем объект пользователя. Этот объект будет закодирован в JWT.
          const user = { 
            id: `sms-${credentials.phone}`, // Создаем уникальный ID на основе номера
            name: credentials.name, 
            phone: credentials.phone, // Можно добавить и сам номер
            email: null, // У пользователя, вошедшего по SMS, нет email
            image: null,
          };
          return user;
        }
        
        // Если authorize возвращает null, происходит ошибка входа.
        return null;
      }
    }),

    /**
     * Провайдер для обработки JWT, полученного от нашего внешнего бэкенда (после авторизации через VK).
     * Мы даем ему уникальный id: 'jwt-provider'.
     */
    CredentialsProvider({
        id: 'jwt-provider',
        name: 'Backend JWT',
        credentials: {
            token: { label: "JWT", type: "text" },
        },
        async authorize(credentials) {
            if (!credentials?.token) {
                return null;
            }
            try {
                // ВНИМАНИЕ: В РЕАЛЬНОМ ПРОЕКТЕ ЗДЕСЬ НУЖНА ПОЛНАЯ ВАЛИДАЦИЯ ПОДПИСИ ТОКЕНА!
                // Например, с помощью библиотеки 'jsonwebtoken' и секрета от вашего бэкенда.
                // const decoded = jwt.verify(credentials.token, process.env.BACKEND_JWT_SECRET);
                
                // Для нашего примера мы просто декодируем токен, чтобы извлечь данные.
                // НЕ ДЕЛАЙТЕ ТАК В ПРОДАКШЕНЕ БЕЗ ВАЛИДАЦИИ!
                const decoded: { sub: string, name: string, email: string, picture?: string } = jwtDecode(credentials.token);
                
                // Возвращаем объект пользователя, который NextAuth сохранит в свою сессию.
                return {
                    id: decoded.sub, // 'sub' (subject) - это стандартное поле для ID в JWT
                    name: decoded.name,
                    email: decoded.email,
                    image: decoded.picture || null,
                };

            } catch (error) {
                console.error("Ошибка: Невалидный JWT от бэкенда.", error);
                return null;
            }
        }
    })
  ],

  // 2. СТРАТЕГИЯ СЕССИИ
  // Мы используем JWT (JSON Web Tokens) для хранения сессии, это не требует базы данных на стороне Next.js.
  session: {
    strategy: "jwt",
  },

  // 3. КАСТОМНЫЕ СТРАНИЦЫ
  // Указываем NextAuth, где находится наша кастомная страница входа.
  pages: {
    signIn: '/login',
  },

  // 4. КОЛБЭКИ (CALLBACKS)
  // Это функции, которые позволяют "вклиниться" в стандартный процесс NextAuth.
  callbacks: {
    /**
     * Этот колбэк вызывается при создании или обновлении JWT.
     * Его задача - перенести данные из объекта `user` (который вернул `authorize`) в `token`.
     */
     async jwt({ token, user }) {
            // При первом входе `user` доступен
            if (user) {
                token.id = user.id;
                // ✅ ДОБАВЛЯЕМ ТЕЛЕФОН В ТОКЕН
                // Мы используем 'as any', чтобы TypeScript не ругался, 
                // т.к. мы расширяем стандартный тип User.
                token.phone = (user as any).phone; 
            }
            return token;
        },
    /**
     * Этот колбэк вызывается при создании объекта сессии (например, когда мы используем `useSession`).
     * Его задача - перенести данные из `token` в объект `session`, который будет доступен на клиенте.
     */
    async session({ session, token }) {
            // Переносим ID и ТЕЛЕФОН из токена в сессию
            if (token && session.user) {
                session.user.id = token.id as string;
                // ✅ ДОБАВЛЯЕМ ТЕЛЕФОН В ОБЪЕКТ СЕССИИ
                (session.user as any).phone = token.phone;
            }
            return session;
        },
  },
};