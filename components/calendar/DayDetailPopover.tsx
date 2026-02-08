import { XMarkIcon } from '@heroicons/react/24/solid';

interface DayData {
    price: number;
    status: 'free' | 'partial' | 'busy';
    // Можно добавить и другие поля, например, описание акций
}

interface DayDetailPopoverProps {
    dayData: DayData;
    date: Date;
    onClose: () => void;
}

export default function DayDetailPopover({ dayData, date, onClose }: DayDetailPopoverProps) {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={onClose} // Закрытие по клику на фон
        >
            <div 
                className="relative bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-sm transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-in"
                onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику на сам поповер
                style={{ animationName: 'pop-in', animationDuration: '0.3s', animationFillMode: 'forwards' }}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                    <XMarkIcon className="h-6 w-6 text-gray-700" />
                </button>
                <h3 className="text-xl font-bold font-istok-web mb-1">{date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</h3>
                <p className="text-lg text-gray-500 mb-4">{date.toLocaleDateString('ru-RU', { weekday: 'long' })}</p>

                <div className="space-y-3">
                    <p className="text-2xl font-bold">{dayData.price}₽ <span className="text-base font-normal text-gray-600">/ ночь</span></p>
                    {dayData.status === 'partial' && <p className="text-yellow-600">Осталось мало номеров</p>}
                    <p className="text-gray-700">Описание дня: здесь может быть информация о специальном предложении, например, "Праздничный тариф" или "Скидка 20%".</p>
                </div>
            </div>
            {/* CSS для анимации */}
            <style jsx global>{`
                @keyframes pop-in {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
