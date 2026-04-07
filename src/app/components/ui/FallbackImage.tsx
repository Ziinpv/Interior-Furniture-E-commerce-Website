import React, { useState } from 'react';

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  'https://picsum.photos/seed/mbt-fallback-image/1200/900';

export function FallbackImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt = '',
  ...props
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [triedFallback, setTriedFallback] = useState(false);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (!triedFallback) {
          setCurrentSrc(fallbackSrc);
          setTriedFallback(true);
        }
      }}
    />
  );
}
