// app/profile/page.tsx
import { getCurrentBookings, getPastBookings, getProfileData } from '@/lib/data';
import { ProfileView } from '@/components/profile/ProfileView';

// Это Серверный Компонент, поэтому мы можем использовать async/await
export default async function ProfilePage() {
    // 1. Асинхронно получаем все данные на сервере
    const profile = await getProfileData();
    const currentBookingsData = await getCurrentBookings();
    const pastBookingsData = await getPastBookings();
    
    // 2. Передаем полученные данные в Клиентский Компонент как props
    return (
        <ProfileView 
            profile={profile}
            initialCurrentBookings={currentBookingsData}
            initialPastBookings={pastBookingsData}
        />
    );
}
