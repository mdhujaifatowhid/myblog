// pages/api/admin/posts.js
import { requireAdmin } from '../../../lib/apiGuard';
import { createPost, updatePost, deletePost, getPostBySlug } from '../../../lib/posts';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'POST') {
      const { title, date, excerpt, thumbnail, content } = req.body || {};
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required.' });
      }
      const slug = await createPost({ title, date, excerpt, thumbnail, content });
      return res.status(200).json({ ok: true, slug });
    }

    if (req.method === 'PUT') {
      const { slug, title, date, excerpt, thumbnail, content } = req.body || {};
      if (!slug || !title) return res.status(400).json({ error: 'slug and title are required.' });
      const current = await getPostBySlug(slug);
      if (!current) return res.status(404).json({ error: 'Post not found.' });
      await updatePost(slug, { title, date, excerpt, thumbnail, content, sha: current.sha });
      return res.status(200).json({ ok: true, slug });
    }

    if (req.method === 'DELETE') {
      const { slug } = req.body || {};
      if (!slug) return res.status(400).json({ error: 'slug is required.' });
      await deletePost(slug);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
    return res.status(405).end();
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Something went wrong.' });
  }
}
