import { useRef, useState } from 'react';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PostForm({ initial, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [author, setAuthor] = useState(initial?.author || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || '');
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState(initial?.thumbnail || '');
  const [content, setContent] = useState(initial?.content || '');
  const [thumbUploading, setThumbUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef(null);

  async function handleThumbnailUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbUploading(true);
    setError('');
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, base64, kind: 'thumbnail' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setThumbnail(data.url);
      setThumbnailUrlInput(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setThumbUploading(false);
      e.target.value = '';
    }
  }

  function handleThumbnailUrlChange(value) {
    setThumbnailUrlInput(value);
    setThumbnail(value.trim());
  }

  async function handleContentImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setContentUploading(true);
    setError('');
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, base64, kind: 'content' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const markdown = `\n![${file.name}](${data.url})\n`;
      const el = textareaRef.current;
      if (el) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const next = content.slice(0, start) + markdown + content.slice(end);
        setContent(next);
        requestAnimationFrame(() => {
          el.focus();
          el.selectionStart = el.selectionEnd = start + markdown.length;
        });
      } else {
        setContent((c) => c + markdown);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setContentUploading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title প্রয়োজন।'); return; }
    setSaving(true);
    try {
      await onSubmit({ title, date, author, excerpt, thumbnail, content });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Author</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Hujaifa"
          />
        </div>
      </div>

      <div className="field">
        <label>Excerpt (short summary shown on the homepage card)</label>
        <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>

      <div className="field">
        <label>Thumbnail Image (used on the homepage card &amp; top of the post)</label>

        <div className="thumb-tabs-note">Upload a file, or paste an image URL — either works:</div>
        <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
        {thumbUploading && <p>আপলোড হচ্ছে...</p>}

        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={thumbnailUrlInput}
          onChange={(e) => handleThumbnailUrlChange(e.target.value)}
          style={{ marginTop: 10 }}
        />

        {thumbnail && (
          <img
            src={thumbnail}
            alt="thumbnail preview"
            className="thumb-preview"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
          />
        )}
      </div>

      <div className="field">
        <label>Content (Markdown supported — use the button below to insert images inside the post)</label>
        <input type="file" accept="image/*" onChange={handleContentImageUpload} style={{ marginBottom: 8 }} />
        {contentUploading && <p>ছবি পোস্টে যোগ হচ্ছে...</p>}
        <textarea
          ref={textareaRef}
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="এখানে আপনার লেখা লিখুন... (Markdown: **bold**, *italic*, ## heading)"
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn-black" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
