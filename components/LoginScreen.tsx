'use client'

import React, { useState ,useRef, ChangeEvent, createRef} from 'react';
import { useRouter} from 'next/navigation'; // 1. Импортируем хук для навигации
import { GoogleIcon, TelegramIcon, VkIcon } from '@/components/ui/Icons';

const LoginScreen: React.FC = () => {
  // 2. Создаем все необходимые состояния
   const [step, setStep] = useState<'phoneInput' | 'codeInput'>('phoneInput');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // 2. Теперь `code` будет массивом из 4 строк
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const router = useRouter();


  // 3. Обработчик для первого шага (получение кода)
  const handleGetCode = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setError(''); // Сбрасываем старые ошибки

    if (!phone || phone.length < 10) {
      setError('Пожалуйста, введите корректный номер телефона.');
      return;
    }
    

    // --- ЗАГЛУШКА ДЛЯ API ---
    // TODO: В будущем здесь будет ваш API-запрос для отправки SMS.
    // Пример:
    // try {
    //   await api.sendVerificationCode(phone);
    //   setStep('codeInput');
    // } catch (apiError) {
    //   setError('Не удалось отправить код. Попробуйте снова.');
    // }
    console.log(`Имитация отправки кода на номер: ${phone}`);
    setStep('codeInput'); // Переходим на следующий шаг
  };

   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join(''); // Собираем код из массива

    if (fullCode.length !== 4) {
      setError('Пожалуйста, введите все 4 цифры.');
      return;
    }
    
    // --- ЗАГЛУШКА ДЛЯ API ---
    const MOCK_CORRECT_CODE = '1234';
    if (fullCode === MOCK_CORRECT_CODE) {
      router.push('/profile');
    } else {
      setError('Неверный код подтверждения.');
      setCode(['', '', '', '']); // Сбрасываем поля
      inputRefs.current[0]?.focus(); // Фокус на первое поле
    }
  };

   const handleCodeChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Принимаем только одну цифру
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Если введена цифра, переводим фокус на следующее поле
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  // 5. Рендерим нужный шаг в зависимости от состояния `step`
  return (
    <div className="w-full max-w-sm rounded-2xl bg-gray-50 p-6 shadow-sm font-sans md:p-8">
      {step === 'phoneInput' && (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Вход</h1>
            <p className="mt-2 text-gray-500">
              Введите ваше имя и номер телефона
            </p>
          </div>

          <form onSubmit={handleGetCode} className="mt-8 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <label className="text-xs text-gray-500">Ваш номер телефона</label>
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-800">+7</span>
                <input
                  type="tel"
                  placeholder="(999) 999-99-99"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Оставляем только цифры
                  maxLength={10}
                  required
                  className="w-full border-none bg-transparent text-lg font-medium text-gray-800 outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full rounded-xl bg-gray-800 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            >
              Получить код
            </button>
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
          </form>

        {/* Разделитель "или" */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-400">или</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        
        {/* Кнопки социальных сетей */}
        <div className="flex justify-center space-x-4">
          <button className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <GoogleIcon />
          </button>
          <button className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <TelegramIcon />
          </button>
          <button className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <VkIcon />
          </button>
        </div>
        </>
      )}

      {step === 'codeInput' && (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Подтверждение</h1>
            <p className="mt-2 text-gray-500">
              Мы отправили код на номер <br />
              <span className="font-medium text-gray-700">+7 {phone}</span>
            </p>
          </div>

         <form onSubmit={handleVerifyCode} className="mt-8 space-y-4">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {inputRefs.current[index] = el}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                  className="h-14 w-12 rounded-xl border border-gray-300 bg-white text-center text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            
            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-gray-800 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            >
              Подтвердить
            </button>

            <button
              type="button"
              onClick={() => { setStep('phoneInput'); setError(''); setCode(['','','','']); }}
              className="w-full text-center text-sm text-gray-600 hover:text-blue-600"
            >
              Изменить номер
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginScreen;

