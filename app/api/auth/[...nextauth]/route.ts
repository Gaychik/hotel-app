// api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authOptions } from "@/lib/auth"; 
 

// Создаем обработчик, который будет отвечать на GET и POST запросы
const handler = NextAuth(authOptions);

// Экспортируем его для Next.js
export { handler as GET, handler as POST };
