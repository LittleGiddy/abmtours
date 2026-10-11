import './load-env';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import type { Db } from 'mongodb';
import { getClientPromise } from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';

const BLOB_URL = /\.public\.blob\.vercel-storage\.com\//;
const DRY_RUN = process.argv.includes('--dry-run');

const onlyArg = process.argv.find((arg) => arg.startsWith('--only='));
const only = onlyArg
  ? onlyArg
      .slice('--only='.length)
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
  : null;

const shouldRun = (name: string): boolean => only === null || only.includes(name);

const FOLDER = {
  gallery: 'abmtours/gallery',
  destinationimages: 'abmtours/destinations',
  packages: 'abmtours/packages',
} as const;

type Asset = { url: string; publicId: string };

const migrated = new Map<string, Asset>();
const failures: string[] = [];
const touchedDocs: { collection: string; id: unknown; slug?: unknown; oldUrls: string[] }[] = [];
let uploaded = 0;
let reused = 0;

function isBlobUrl(value: unknown): value is string {
  return typeof value === 'string' && BLOB_URL.test(value);
}

function collectBlobUrls(value: unknown, found: Set<string> = new Set()): Set<string> {
  if (isBlobUrl(value)) {
    found.add(value);
    return found;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectBlobUrls(item, found);
    return found;
  }

  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) collectBlobUrls(nested, found);
  }

  return found;
}

function replaceBlobUrls(value: unknown, replacements: Map<string, string>): unknown {
  if (typeof value === 'string') {
    return replacements.get(value) ?? value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceBlobUrls(item, replacements));
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      result[key] = replaceBlobUrls(nested, replacements);
    }
    return result;
  }

  return value;
}

function filenameFromUrl(url: string, contentType: string): string {
  const base = path.basename(new URL(url).pathname) || 'image';
  if (/\.[a-z0-9]+$/i.test(base)) return base;

  const extensionByType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
  };

  return `${base}.${extensionByType[contentType] ?? 'jpg'}`;
}

async function migrateUrl(blobUrl: string, folder: string): Promise<Asset> {
  const cached = migrated.get(blobUrl);
  if (cached) {
    reused++;
    return cached;
  }

  const response = await fetch(blobUrl);
  if (!response.ok) {
    throw new Error(`download failed with status ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? 'image/jpeg';
  const file = new File([buffer], filenameFromUrl(blobUrl, contentType), {
    type: contentType,
  });

  const asset = await uploadImage(file, folder);
  uploaded++;
  migrated.set(blobUrl, { url: asset.url, publicId: asset.publicId });
  return { url: asset.url, publicId: asset.publicId };
}

async function migrateImageCollection(
  db: Db,
  collectionName: string,
  folder: string
) {
  const collection = db.collection(collectionName);
  const cursor = collection.find({ url: BLOB_URL } as never);

  let scanned = 0;
  let changed = 0;

  for await (const doc of cursor) {
    scanned++;

    if (!isBlobUrl(doc.url)) continue;

    if (DRY_RUN) {
      changed++;
      continue;
    }

    try {
      const asset = await migrateUrl(doc.url, folder);
      await collection.updateOne(
        { _id: doc._id },
        { $set: { url: asset.url, publicId: asset.publicId } }
      );
      touchedDocs.push({
        collection: collectionName,
        id: doc._id,
        oldUrls: [doc.url],
      });
      changed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${collectionName}/${doc._id}: ${message}`);
      console.error(`  ! ${collectionName}/${doc._id} -> ${message}`);
    }
  }

  console.log(`  ${collectionName}: scanned ${scanned}, ${DRY_RUN ? 'would migrate' : 'migrated'} ${changed}`);
  return changed;
}

async function migratePackages(db: Db) {
  const collection = db.collection('packages');
  const cursor = collection.find({} as never);

  let scanned = 0;
  let changed = 0;

  for await (const doc of cursor) {
    scanned++;

    const blobUrls = [...collectBlobUrls(doc)];
    if (blobUrls.length === 0) continue;

    if (DRY_RUN) {
      changed++;
      console.log(`  would migrate ${blobUrls.length} image(s) in package ${doc.slug ?? doc._id}`);
      continue;
    }

    const replacements = new Map<string, string>();
    let failed = false;

    for (const blobUrl of blobUrls) {
      try {
        const asset = await migrateUrl(blobUrl, FOLDER.packages);
        replacements.set(blobUrl, asset.url);
      } catch (error) {
        failed = true;
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`packages/${doc._id}: ${message}`);
        console.error(`  ! packages/${doc._id} -> ${message}`);
        break;
      }
    }

    if (failed) continue;

    await collection.updateOne(
      { _id: doc._id },
      { $set: replaceBlobUrls(doc, replacements) as never }
    );
    touchedDocs.push({
      collection: 'packages',
      id: doc._id,
      slug: doc.slug,
      oldUrls: blobUrls,
    });
    changed++;
  }

  console.log(`  packages: scanned ${scanned}, ${DRY_RUN ? 'would migrate' : 'migrated'} ${changed}`);
  return changed;
}

async function main() {
  const required = ['MONGODB_URI'];
  if (!DRY_RUN) {
    required.push('CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET');
  }

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variable(s): ${missing.join(', ')}`);
  }

  const client = await getClientPromise();
  const db = client.db('abmtours');

  console.log(DRY_RUN ? 'Dry run - no uploads and no writes\n' : 'Migrating Vercel Blob images to Cloudinary\n');

  if (shouldRun('gallery')) {
    await migrateImageCollection(db, 'gallery', FOLDER.gallery);
  }

  if (shouldRun('destinationimages')) {
    await migrateImageCollection(db, 'destinationimages', FOLDER.destinationimages);
  }

  if (shouldRun('packages')) {
    await migratePackages(db);
  }

  console.log(`\nUploaded ${uploaded} new asset(s), reused ${reused} already-migrated asset(s).`);

  if (!DRY_RUN && touchedDocs.length > 0) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(process.cwd(), `cloudinary-migration-backup-${stamp}.json`);

    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          note: 'Revert map: replace each oldUrl with its newUrl to undo this migration.',
          mapping: Object.fromEntries(migrated),
          documents: touchedDocs,
        },
        null,
        2
      )
    );

    console.log(`\nRevert manifest written to ${path.basename(backupPath)} (${touchedDocs.length} documents).`);
    console.log('Move it out of the repo before committing - it is not gitignored.');
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} failure(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log('\nDone. Source Blob objects were left untouched.');
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exitCode = 1;
});