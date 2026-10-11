// lib/cropImage.ts
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export interface CropOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: string;
}

/**
 * Crop (and optionally rotate/downscale) an image on the client.
 * Returns a Blob ready to upload. Rotation is applied the same way
 * react-easy-crop expects, so pixelCrop coordinates stay correct.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  options: CropOptions = {}
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Draw the (possibly rotated) full image on an intermediate canvas.
  const rotated = document.createElement('canvas');
  rotated.width = bBoxWidth;
  rotated.height = bBoxHeight;
  const rctx = rotated.getContext('2d');
  if (!rctx) throw new Error('Canvas context not available');
  rctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  rctx.rotate(rotRad);
  rctx.translate(-image.width / 2, -image.height / 2);
  rctx.drawImage(image, 0, 0);

  // Downscale so the output never exceeds maxDimension.
  const maxDimension = options.maxDimension ?? 2400;
  const scale = Math.min(1, maxDimension / Math.max(pixelCrop.width, pixelCrop.height));
  const outW = Math.max(1, Math.round(pixelCrop.width * scale));
  const outH = Math.max(1, Math.round(pixelCrop.height * scale));

  const cropped = document.createElement('canvas');
  cropped.width = outW;
  cropped.height = outH;
  const cctx = cropped.getContext('2d');
  if (!cctx) throw new Error('Canvas context not available');
  cctx.drawImage(
    rotated,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH
  );

  return new Promise((resolve, reject) => {
    cropped.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      options.mimeType ?? 'image/jpeg',
      options.quality ?? 0.9
    );
  });
}
