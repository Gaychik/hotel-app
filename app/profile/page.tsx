// app/profile/page.tsx

import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Профиль</h1>
        <p className="mt-4 text-lg text-gray-600">
          Вы успешно вошли в систему!
        </p>
        <p className="mt-2 text-sm text-gray-500">
          (Здесь будет содержимое вашего профиля)
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
