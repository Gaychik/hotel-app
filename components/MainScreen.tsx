// components/MainScreen.tsx (бывший MainScreen.js)

import React from 'react';
import Header from './layout/Header';
import HeroSection from './layout/HeroSection';
import InfoSection from './layout/InfoSection';

const MainScreen: React.FC = () => {
    return (
        <div className="bg-gray-100 font-sans">
            <Header />
            <main>
                <HeroSection />
                <InfoSection />
            </main>
            {/* Здесь в будущем может быть Footer */}
        </div>
    );
};

export default MainScreen;
