// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Обертка для Suspense, т.к. useSearchParams этого требует
const CallbackContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Ловим токен из URL
    const error = searchParams.get('error');

    useEffect(() => {
        // Если бэкенд вернул ошибку
        if (error) {
            console.error("Ошибка авторизации от бэкенда:", error);
            router.push('/login?error=OAuthFailed');
            return;
        }

        // Если есть токен, пытаемся войти с ним
        if (token) {
            // Вызываем signIn с нашим кастомным JWT-провайдером
            signIn('jwt-provider', {
                token,
                redirect: false, // Мы сами управляем редиректом
            }).then(result => {
                if (result?.ok) {
                    // Успех! Перенаправляем в профиль.
                    router.push('/profile');
                } else {
                    // Если next-auth не принял токен
                    router.push('/login?error=InvalidToken');
                }
            });
        } else {
            // Если зашли на страницу без токена
            router.push('/login');
        }
    }, [token, error, router]);

    // Пока идет процесс, показываем заглушку
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p className="text-lg animate-pulse">Аутентификация...</p>
        </div>
    );
};


// Экспортируем страницу
import { Suspense } from 'react';

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Загрузка...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
