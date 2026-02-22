'use client'

import React, { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { VkIcon } from '@/components/ui/Icons'; // Убедитесь, что иконка находится по этому пути
import { signIn } from 'next-auth/react';

// Получаем URL бэкенда из переменных окружения
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const LoginScreen: React.FC = () => {
    const [step, setStep] = useState<'phoneInput' | 'codeInput'>('phoneInput');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState<string[]>(['', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // --- Шаг 1: Пользователь вводит номер и нажимает "Получить код" ---
    const handleGetCode = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError('Пожалуйста, введите ваше имя.');
            return;
        }
        if (!phone || phone.length < 10) {
            setError('Пожалуйста, введите корректный номер телефона.');
            return;
        }
        // TODO: Здесь будет ваш API-запрос для отправки SMS.
        console.log(`Имитация отправки кода на номер: ${phone}`);
        setStep('codeInput');
    };

    // --- Логика для входа через VK ---
    const handleVkLogin = () => {
        // Мы используем window.location.href, потому что переходим на ВНЕШНИЙ АДРЕС (наш бэкенд),
        // а не на другую страницу внутри нашего Next.js приложения. useRouter() для этого не предназначен.
        window.location.href = `${BACKEND_URL}/auth/vk/login`;
    };

    // --- Шаг 2: Пользователь вводит код и нажимает "Подтвердить" ---
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const fullCode = code.join('');

        if (fullCode.length !== 4) {
            setError('Пожалуйста, введите все 4 цифры.');
            setIsLoading(false);
            return;
        }

        // Вызываем signIn для нашего SMS-провайдера, передавая все нужные данные
        const result = await signIn('sms-provider', {
            redirect: false,
            name: name,
            phone: phone,
            code: fullCode,
        });

        setIsLoading(false);
        if (result?.ok) {
            // Если authorize в NextAuth вернул пользователя, перенаправляем в профиль
            router.push('/profile');
        } else {
            // Если authorize вернул null, показываем ошибку
            setError('Неверный код подтверждения. Попробуйте "1234".');
            setCode(['', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };
    
    // --- Логика для полей ввода кода ---
    const handleCodeChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
                
                {/* --- Рендеринг первого шага (ввод телефона) --- */}
                {step === 'phoneInput' && (
                    <form onSubmit={handleGetCode} className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Вход</h1>
                            <p className="mt-2 text-sm text-gray-600">Введите ваше имя и номер телефона</p>
                        </div>
                        <input
                            type="text"
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                            <span className="font-semibold text-gray-600">+7</span>
                            <input
                                type="tel"
                                placeholder="(999) 999-99-99"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                maxLength={10}
                                required
                                className="ml-2 w-full border-none bg-transparent text-lg font-medium text-gray-800 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gray-800 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                        >
                            Получить код
                        </button>
                        {error && <p className="text-center text-sm text-red-500">{error}</p>}
                        
                        <div className="flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 flex-shrink text-sm text-gray-500">или</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button 
                                type="button" 
                                onClick={handleVkLogin} 
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                                aria-label="Войти через ВКонтакте"
                            >
                                <VkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </form>
                )}

                {/* --- Рендеринг второго шага (ввод кода) --- */}
                {step === 'codeInput' && (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Подтверждение</h1>
                            <p className="mt-2 text-sm text-gray-600">Мы отправили код на номер<br/>+7 {phone}</p>
                        </div>
                        <div className="flex justify-center space-x-3">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    required
                                    className="h-16 w-12 rounded-xl border border-gray-300 bg-white text-center text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>
                        {error && <p className="text-center text-sm text-red-500">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-gray-800 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Проверка...' : 'Подтвердить'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep('phoneInput'); setError(''); setCode(['', '', '', '']); }}
                            className="w-full text-center text-sm text-gray-600 hover:text-blue-600"
                        >
                            Изменить номер
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginScreen;
