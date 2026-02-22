// components/booking/FailureConfirmation.tsx
'use client';

import Link from 'next/link';
import { AnimatedStatusIcon } from '@/components/ui/AnimatedStatusIcon';

export const FailureConfirmation: React.FC = () => {
  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto text-center">
      <AnimatedStatusIcon status="failure" />
      <h1 className="text-3xl font-bold font-karantina mt-6">Оплата не прошла</h1>
      <p className="text-gray-600 mt-2">К сожалению, произошла ошибка при обработке платежа. Средства не были списаны.</p>
      
      <div className="mt-8">
        <Link href="/booking" className="w-full bg-black text-white font-semibold py-3 px-8 rounded-lg transition-colors hover:bg-gray-800">
          Попробовать снова
        </Link>
      </div>
    </div>
  );
};
