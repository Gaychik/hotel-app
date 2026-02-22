// components/layout/InfoSection.tsx
import React from 'react';
import { StarIcon } from '@/components/ui/Icons';
import InfoCard from '@/components/ui/InfoCard';
interface InfoSectionProps {
  onReviewsClick: () => void; // ✅ Пропс для обработки клика
}



const InfoSection: React.FC<InfoSectionProps> = ({ onReviewsClick }) => {
  // ✅ Создадим массив данных для удобного маппинга и добавления задержки
  const cardsData = [
    {
      title: "125 номеров",
      description: "Премиальные апартаменты на любой вкус"
    },
    {
      title: "Услуги отеля",
      description: "От спа и фитнеса до бизнес-центра"
    },

    { id: 'rating', isRating: true, rating: "4.8", reviews: "78 отзывов", guests: "5 000+ гостей" },
    { id: 'reviews', title: "Читать отзывы", description: "Посмотрите, что говорят о нас" }
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {cardsData.map((card, index) => (
          <InfoCard
            key={index}
            // ✅ ГЛАВНЫЙ СЕКРЕТ: Добавляем инлайновый стиль для задержки анимации.
            // Каждая следующая карточка будет появляться на 150ms позже.
            style={{ transitionDelay: `${index * 150}ms` }}
            onClick={card.id === 'reviews' ? onReviewsClick : undefined}
          >
            {card.isRating ? (
              // Карточка с рейтингом
              <>
                <a href="#" className="absolute top-4 right-5 text-sm text-gray-500 underline hover:text-blue-600 transition-colors">
                  {card.reviews}
                </a>
                <div className="flex items-center gap-2">
                  <StarIcon />
                  <h2 className="text-3xl font-semibold font-source-serif-pro text-gray-800">{card.rating}</h2>
                </div>
                <p className="mt-2 text-gray-600">{card.guests}</p>
              </>
            ) : (
              // Обычная карточка
              <>
                <h2 className="text-3xl font-semibold font-source-serif-pro text-gray-800">{card.title}</h2>
                <p className="mt-2 text-gray-600">{card.description}</p>
              </>
            )}
          </InfoCard>
        ))}
        
      </div>
    </section>
  );
};

export default InfoSection;
