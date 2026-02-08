// components/ui/SearchPill.tsx
import React from 'react';

interface SearchPillProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SearchPill: React.FC<SearchPillProps> = ({ children, onClick, className = '' }) => {
  const baseClasses = "flex items-center p-4 h-full transition-all duration-300";
  const interactiveClasses = onClick ? "cursor-pointer hover:bg-white/50" : "";
  
  return (
    <div onClick={onClick} className={`${baseClasses} ${interactiveClasses} ${className}`}>
      {children}
    </div>
  );
};

export default SearchPill;
