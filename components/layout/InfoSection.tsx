// components/layout/InfoSection.tsx

import React from 'react';
import { StarIcon } from '@/components/ui/Icons';
import InfoCard from '@/components/ui/InfoCard';

const InfoSection: React.FC = () => {
    return (
        <section className="bg-white py-16 lg:py-24">
            {/* 
                БЫЛО: grid-cols-4
                СТАЛО: grid-cols-3
                Теперь у нас три информационные карточки.
            */}
            <div className="container mx-auto px-4 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <InfoCard>
                    <h2 className="text-3xl font-semibold font-source-serif-pro text-gray-800">125 номеров</h2>
                    <p className="mt-2 text-gray-600">
                        Премиальные апартаменты на любой вкус
                    </p>
                </InfoCard>

                <InfoCard>
                    <h2 className="text-3xl font-semibold font-source-serif-pro text-gray-800">Услуги отеля</h2>
                    <p className="mt-2 text-gray-600">
                        От спа и фитнеса до бизнес-центра
                    </p>
                </InfoCard>

                {/* ОБЪЕДИНЕННАЯ КАРТОЧКА */}
                <InfoCard>
                    {/* Ссылка на отзывы с абсолютным позиционированием */}
                    <a 
                        href="#" 
                        className="absolute top-4 right-5 text-sm text-gray-500 underline hover:text-blue-600 transition-colors"
                    >
                        78 отзывов
                    </a>

                    {/* Основной контент карточки */}
                    <div className="flex items-center gap-2">
                        <StarIcon />
                        <h2 className="text-3xl font-semibold font-source-serif-pro text-gray-800">4.8</h2>
                    </div>
                    <p className="mt-2 text-gray-600">
                        5 000+ гостей
                    </p>
                </InfoCard>
                
            </div>
        </section>
    );
};

export default InfoSection;
