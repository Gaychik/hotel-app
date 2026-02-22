// components/ui/AnimatedStatusIcon.tsx
'use client';

interface AnimatedStatusIconProps {
  status: 'success' | 'failure';
}

export const AnimatedStatusIcon: React.FC<AnimatedStatusIconProps> = ({ status }) => {
  const isSuccess = status === 'success';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const strokeColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mx-auto`}>
      <svg className={`w-16 h-16 ${strokeColor}`} viewBox="0 0 52 52">
        {/* Круг, который будет "рисоваться" */}
        <circle 
          className="circle-path" 
          cx="26" 
          cy="26" 
          r="25" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
        />
        {/* Условный рендеринг галочки или крестика */}
        {isSuccess ? (
          // Галочка
          <path 
            className="check-path" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            d="M14 27l8 8 16-16" 
          />
        ) : (
          // Крестик
          <>
            <path 
              className="cross-path" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              d="M16 16 36 36" 
            />
             <path 
              className="cross-path cross-path--delay" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              d="M36 16 16 36" 
            />
          </>
        )}
      </svg>
    </div>
  );
};
