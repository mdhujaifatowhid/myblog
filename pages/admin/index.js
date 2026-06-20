import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getAllPosts } from '../../lib/posts';
import { isValidSessionCookie } from '../../lib/auth';

export default function AdminDashboard({ posts }) {
  const router = useRouter();
  const [list, setList] = useState(posts);
  const [busy, setBusy] = useState(null);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  async function handleDelete(slug) {
    if (!confirm(`"${slug}" Are you sure you want to delete this post?`)) return;
    setBusy(slug);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setList((l) => l.filter((p) => p.slug !== slug));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <Head><title>Admin Dashboard — Simple Blog</title></Head>
      <div className="admin-shell">
        <div className="admin-bar">
          <h1 style={{ fontSize: '1.6rem' }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/admin/new" className="btn-black">+ New Post</Link>
            <Link href="/" className="btn-small">View Site</Link>
            <button className="btn-small" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {list.length === 0 && <p>There are no posts yet. Click &quot;+ New Post&quot; to get started.</p>}

        {list.map((p) => (
          <div className="admin-post-row" key={p.slug}>
            <div>
              <strong>{p.title}</strong>
              <div style={{ fontSize: '0.85rem', color: '#6b665f' }}>
                {p.date} — /{p.slug}
              </div>
            </div>
            <div className="actions">
              <Link href={`/posts/${p.slug}`} className="btn-small" target="_blank">View</Link>
              <Link href={`/admin/edit/${p.slug}`} className="btn-small">Edit</Link>
              <button
                className="btn-small btn-danger"
                onClick={() => handleDelete(p.slug)}
                disabled={busy === p.slug}
              >
                {busy === p.slug ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  if (!isValidSessionCookie(req.headers.cookie)) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  let posts = [];
  try {
    posts = await getAllPosts();
  } catch (err) {
    console.error(err.message);
  }
  return { props: { posts } };
}
