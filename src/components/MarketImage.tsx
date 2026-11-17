import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface MarketImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function MarketImage({ src, alt, className = '' }: MarketImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EEF2EC] to-[#DFE6DC] dark:from-[#1A241D] dark:to-[#121914] text-[#354F3B] dark:text-[#98B49F] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <ShoppingBag className="w-7 h-7 mb-2 opacity-70" />
        <span className="text-xs font-medium leading-snug max-w-[18ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
