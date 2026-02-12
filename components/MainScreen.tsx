'use client'

import React, { useState } from 'react';
import Header from './layout/Header';
import HeroSection from './layout/HeroSection';
import InfoSection from './layout/InfoSection';
import FavoritesList from './FavoritesList';

const MainScreen: React.FC = () => {
    const [showFavorites, setShowFavorites] = useState(false);

    return (
        <div className='bg-gray-100 font-sans'>
            <Header />
            
    
            <div className='fixed top-1/2 right-4 transform -translate-y-1/2 z-40'>
                <button
                    onClick={() => setShowFavorites(true)}
                    className='p-4 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow'
                    aria-label='Избранные номера'
                >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                    </svg>
                </button>
            </div>
            
            <main>
                <HeroSection />
                <InfoSection />
            </main>
       
            <FavoritesList 
                isOpen={showFavorites} 
                onClose={() => setShowFavorites(false)} 
            />
        </div>
    );
};

export default MainScreen;
