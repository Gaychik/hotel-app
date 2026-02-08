import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BookingDetailsPanelProps {
  selectedRange: DateRange | undefined;
}

export default function BookingDetailsPanel({ selectedRange }: BookingDetailsPanelProps) {
  if (!selectedRange?.from) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg h-full flex flex-col justify-center items-center text-center">
        <h2 className="text-xl font-bold mb-2 font-istok-web">Детали бронирования</h2>
        <p className="text-gray-500">Выберите даты в календаре, чтобы увидеть доступные номера и рассчитать стоимость.</p>
      </div>
    );
  }

  const checkIn = selectedRange.from;
  const checkOut = selectedRange.to;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg h-full">
      <h2 className="text-2xl font-bold mb-4 font-istok-web">Ваш выбор</h2>
      <div className="space-y-4">
        <div>
            <h3 className="font-semibold">Заезд</h3>
            <p className="text-lg text-blue-700">{format(checkIn, 'd MMMM yyyy', { locale: ru })}</p>
        </div>
        {checkOut && (
            <div>
                <h3 className="font-semibold">Выезд</h3>
                <p className="text-lg text-blue-700">{format(checkOut, 'd MMMM yyyy', { locale: ru })}</p>
            </div>
        )}
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="text-xl font-bold mb-4 font-istok-web">Рекомендованные номера</h3>
        {/* TODO: Здесь будет логика отображения карточек номеров */}
        <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50">
                <p className="font-bold">Номер "Стандарт"</p>
                <p className="text-sm text-gray-600">Отличный выбор для двоих.</p>
                <p className="text-right font-bold text-lg">15 000 ₽</p>
            </div>
             <div className="p-4 border rounded-lg bg-gray-50">
                <p className="font-bold">Номер "Делюкс"</p>
                <p className="text-sm text-gray-600">Простор и комфорт.</p>
                <p className="text-right font-bold text-lg">25 000 ₽</p>
            </div>
        </div>
      </div>
    </div>
  );
}
