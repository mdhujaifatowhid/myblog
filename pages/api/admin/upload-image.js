// pages/api/admin/upload-image.js
import { requireAdmin } from '../../../lib/apiGuard';
import { putBinaryFile, rawUrl } from '../../../lib/github';

export const config = {
  api: {
    bodyParser: { sizeLimit: '8mb' },
  },
};

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { filename, base64, kind } = req.body || {};
    if (!filename || !base64) {
      return res.status(400).json({ error: 'filename and base64 are required.' });
    }
    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '-');
    const folder = kind === 'thumbnail' ? 'uploads/thumbnails' : 'uploads/content';
    const path = `${folder}/${Date.now()}-${safeName}`;

    // strip data:image/...;base64, prefix if present
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    await putBinaryFile(path, cleanBase64, `Upload image: ${path}`);
    return res.status(200).json({ ok: true, url: rawUrl(path) });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Upload failed.' });
  }
}
