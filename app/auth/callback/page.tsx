// app/auth/vk-callback/page.tsx

'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const CallbackContent = () => {
    const router = useRouter();

    useEffect(() => {
        // Эта функция выполнится один раз при загрузке страницы
        const completeVkAuth = async () => {
            // 1. Получаем exchange_token, который мы сохранили ранее
            const exchangeToken = sessionStorage.getItem('vk_exchange_token');

            if (!exchangeToken) {
                // Если токена нет, значит что-то пошло не так. Отправляем на страницу логина.
                router.push('/login?error=ExchangeFailed');
                return;
            }

            // Сразу удаляем токен, он одноразовый
            sessionStorage.removeItem('vk_exchange_token');

            try {
                // 2. Отправляем POST-запрос на вторую ручку бэкенда
                const response = await fetch(`${BACKEND_URL}/auth/oauth/vk/exchange`, { // Уточните URL у бэкенд-разработчика
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ exchange_token: exchangeToken }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка обмена токена на стороне бэкенда.');
                }
                
                const { access_token } = await response.json();

                if (!access_token) {
                    throw new Error('Бэкенд не вернул access_token.');
                }

                // 3. Используем полученный access_token (JWT) для входа через next-auth
                const result = await signIn('jwt-provider', {
                    token: access_token,
                    redirect: false, // Мы сами управляем редиректом
                });

                if (result?.ok) {
                    // Успех! Перенаправляем в личный кабинет.
                    router.push('/profile');
                } else {
                    throw new Error(result?.error || 'Next-Auth не смог авторизовать токен.');
                }

            } catch (error: any) {
                console.error("Финальная ошибка VK-аутентификации:", error);
                router.push(`/login?error=${error.message || 'AuthFailed'}`);
            }
        };

        completeVkAuth();
    }, [router]);

    // Пока идет процесс, показываем заглушку
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-gray-800" />
                <p className="text-lg text-gray-600">Завершаем аутентификацию...</p>
            </div>
        </div>
    );
};

// Экспортируем страницу с Suspense
export default function VkCallbackPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Загрузка...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
