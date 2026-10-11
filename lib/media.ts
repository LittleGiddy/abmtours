import { destroyAsset } from '@/lib/cloudinary';

type StoredImage = {
  url?: string | null;
  publicId?: string | null;
};

/**
 * Removes the underlying asset for a stored image record.
 *
 * All images uploaded from the admin panel now live in Cloudinary and are
 * deleted by their `publicId`. Legacy rows created before the Cloudinary
 * migration have no `publicId`; their Vercel Blob objects are intentionally
 * left untouched (the store is unreachable and we never write to Blob again).
 */
export async function removeStoredAsset(meta: StoredImage): Promise<void> {
  if (meta.publicId) {
    await destroyAsset(meta.publicId);
  }
}
