// pages/api/download/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method Not Allowed');

  const { id } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const fileDoc = await db.collection('files').findOne({ _id: new ObjectId(id as string) });

    if (!fileDoc || !fileDoc.data) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileBuffer = fileDoc.data.buffer;
    const filename = fileDoc.name || 'file.dat';
    const mimeType = fileDoc.mimeType || 'application/octet-stream';

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', mimeType);
    res.send(fileBuffer);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
}
