// components/ui/Icons.tsx

import React from 'react';

// Определяем правильный тип для наших иконок, чтобы они могли принимать className и другие SVG-атрибуты
type IconProps = React.FC<React.SVGProps<SVGSVGElement>>;

// --- Иконки для Layout и UI ---

export const MenuIcon: IconProps = (props) => (
  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

export const HeartIcon: IconProps = (props) => (
  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

export const CalendarIcon: IconProps = (props) => (
  <svg className="w-5 h-5 text-gray-800" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

export const UserIcon: IconProps = (props) => (
    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const GuestsIcon: IconProps = (props) => (
    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const BedIcon: IconProps = (props) => (
    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

export const StarIcon: IconProps = (props) => (
    <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export const CloseIcon: IconProps = (props) => (
  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// --- Иконки для Соцсетей (восстановлены path-данные) ---

export const GoogleIcon: IconProps = (props) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" {...props}>
    <path fill="#4285F4" d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z"/>
    <path fill="#34A853" d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98,.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z"/>
    <path fill="#FBBC05" d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43,.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z"/>
    <path fill="#EA4335" d="M12,5.38c1.62,0,3.06,.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z"/>
  </svg>
);

export const TelegramIcon: IconProps = (props) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#2AABEE" {...props}>
    <path d="M9.78,18.65l.28-4.23l7.68-6.72c.22-.19,.04-.51-.24-.43l-9.8,3.95c-.21,.08-.34,.29-.29,.51l.82,3.31c.07,.27,.39,.41,.63,.26l2.12-1.28c.19-.11,.45-.09,.61,.05l2.45,2.18c.21,.19,.24,.51,.05,.73l-1.5,1.67c-.19,.21-.5,.22-.72,.03l-3.52-3.04c-.16-.14-.38-.14-.54,0l-1.89,1.36c-.32,.23-.39,.7-.15,1.01l.01,.01Z"/>
  </svg>
);

export const VkIcon: IconProps = (props) => (
  <svg className="w-6 h-6" viewBox="0 0 128 128" {...props}>
    <path fill="#0077FF" d="M128,64c0,35.346-28.654,64-64,64S0,99.346,0,64S28.654,0,64,0S128,28.654,128,64Z"/>
    <path fill="#FFF" d="M86.427,87.382c-1.32,1.826-3.01,3.208-5.068,4.145-2.34,1.066-4.945,1.6-7.817,1.6h-5.973c-3.38,0-6.84-0.65-10.38-1.956-4.04-1.503-7.52-3.69-10.43-6.56-3.02-2.98-5.32-6.56-6.9-10.74-1.72-4.52-2.58-9.43-2.58-14.74V38.83h16.89v20.45c0,3.69,0.52,6.79,1.55,9.3,1.03,2.51,2.58,4.52,4.64,6.03,2.06,1.51,4.4,2.26,6.99,2.26h0.77c2.06,0,3.81-0.57,5.25-1.7,1.44-1.13,2.15-2.6,2.15-4.41V38.83h16.89v31.43c0,3.38-0.73,6.1-2.19,8.16-1.46,2.06-3.6,3.48-6.42,4.28Z"/>
  </svg>
);
