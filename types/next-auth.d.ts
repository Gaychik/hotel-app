// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

// Расширяем стандартные интерфейсы
declare module "next-auth" {
  /**
   * Возвращается хуком `useSession`, а также в `getSession`
   */
  interface Session {
    user: {
      /** ID пользователя, который мы добавили. */
      id: string;
      phone?: string | null;
    } & DefaultSession["user"] // ... и остальные стандартные поля (name, email, image)
  }
}

declare module "next-auth/jwt" {
  /** Возвращается функцией `getToken`, а также в колбэке `jwt` */
  interface JWT extends DefaultJWT {
    id: string;
      phone?: string | null; 
  }
}
