import type { ImageLoaderProps } from 'next/image';

const CLOUDINARY_DELIVERY_URL =
  /^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.+)$/;

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const match = CLOUDINARY_DELIVERY_URL.exec(src);
  if (!match) return src;

  const [, cloudName, assetPath] = match;

  const transformations = ['f_auto', `w_${width}`];
  transformations.push(quality ? `q_${quality}` : 'q_auto');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${assetPath}`;
}