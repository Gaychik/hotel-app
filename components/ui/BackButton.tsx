'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group absolute top-4 left-4 z-10 flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200"
    >
      <ArrowLeftIcon className="h-6 w-6 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="font-semibold">Назад</span>
    </button>
  );
};
