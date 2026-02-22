// app/booking/success/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessConfirmation } from '@/components/booking/SuccessConfirmation';
import { FailureConfirmation } from '@/components/booking/FailureConfirmation';

// Этот компонент-обертка будет решать, что показать: успех или провал.
const ConfirmationDispatcher = () => {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const error = searchParams.get('error'); // Ищем параметр 'error'

    if (error) {
        return <FailureConfirmation />;
    }

    if (bookingId) {
        return <SuccessConfirmation bookingId={bookingId} />;
    }
    
    // Фолбэк на случай, если нет ни bookingId, ни error
    return <div className="text-center"><h1 className="font-bold text-xl">Ошибка: Некорректные параметры.</h1></div>;
};


const SuccessPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Suspense fallback={<div className="text-center">Загрузка...</div>}>
                <ConfirmationDispatcher />
            </Suspense>
        </div>
    );
}

export default SuccessPage;
