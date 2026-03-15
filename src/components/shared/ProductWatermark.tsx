'use client';

import { cn } from '@/lib/utils';

interface ProductWatermarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductWatermark({ className, size = 'md' }: ProductWatermarkProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 rounded-xl',
    md: 'w-10 h-10 sm:w-12 sm:h-12 p-2 sm:p-2.5 rounded-2xl',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 p-3 sm:p-4 rounded-3xl',
  };

  return (
    <div 
      className={cn(
        "absolute top-4 left-4 z-10 flex items-center justify-center overflow-hidden",
        "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
        sizeClasses[size],
        className
      )}
    >
      <img
        src="/logo2.png"
        alt="Vizhu Logo"
        className="w-full h-full object-contain brightness-0 invert opacity-90 select-none pointer-events-none"
      />
    </div>
  );
}
