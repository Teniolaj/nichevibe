'use client';

import Image from 'next/image';

interface AnimeCoverImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

/**
 * Optimized anime cover image using next/image.
 * Use fill=true when parent has position:relative and explicit dimensions.
 */
export function AnimeCoverImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className,
  style,
  priority = false,
}: AnimeCoverImageProps) {
  if (!src) return null;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? '(max-width: 640px) 50vw, 200px'}
        className={className}
        style={{ objectFit: 'cover', ...style }}
        priority={priority}
      />
    );
  }

  const w = width ?? 200;
  const h = height ?? 280;
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes ?? `(max-width: 640px) 50vw, ${w}px`}
      className={className}
      style={{ objectFit: 'cover', ...style }}
      priority={priority}
    />
  );
}
