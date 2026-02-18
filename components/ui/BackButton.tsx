// components/ui/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export const BackButton = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            // ✅ Улучшенные стили для позиционирования и внешнего вида
            className="absolute top-4 left-4 z-20 flex items-center justify-center h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg hover:scale-110 active:scale-95"
            aria-label="Назад"
        >
            <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
        </button>
    );
};