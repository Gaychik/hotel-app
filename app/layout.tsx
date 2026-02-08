// app/layout.tsx

import type { Metadata } from "next";
// Вот здесь исправлен импорт: Source_Serif_Pro -> Source_Serif_4
import { Inter, Karantina, Istok_Web, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";

// Настраиваем шрифты с CSS-переменными
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const karantina = Karantina({ weight: "400", subsets: ["latin"], variable: "--font-karantina" });
const istok = Istok_Web({ weight: "400", subsets: ["cyrillic", "latin"], variable: "--font-istok-web" });
// И здесь тоже используем правильное имя
const sourceSerif = Source_Serif_4({ weight: ["400", "600"], subsets: ["cyrillic", "latin"], variable: "--font-source-serif-pro" });

export const metadata: Metadata = {
  title: "Hotel California",
  description: "Добро пожаловать в наш отель!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="light">
      {/* Переменная для Source Serif Pro будет --font-source-serif-pro, как мы и указали в tailwind.config.ts */}
      <body className={`${inter.variable} ${karantina.variable} ${istok.variable} ${sourceSerif.variable} font-sans`}>
        
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
