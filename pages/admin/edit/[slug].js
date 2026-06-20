import Head from 'next/head';
import { useRouter } from 'next/router';
import PostForm from '../../../components/PostForm';
import { getPostBySlug } from '../../../lib/posts';
import { isValidSessionCookie } from '../../../lib/auth';

export default function EditPost({ post }) {
  const router = useRouter();

  if (!post) {
    return <div className="admin-shell"><p>Post not found.</p></div>;
  }

  async function handleSubmit(values) {
    const res = await fetch('/api/admin/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: post.slug, ...values }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update post.');
    router.push('/admin');
  }

  return (
    <>
      <Head><title>Edit: {post.title} — Admin</title></Head>
      <div className="admin-shell">
        <h1 style={{ fontSize: '1.6rem', marginBottom: 24 }}>Edit Post</h1>
        <PostForm initial={post} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  if (!isValidSessionCookie(req.headers.cookie)) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  let post = null;
  try {
    post = await getPostBySlug(params.slug);
  } catch (err) {
    console.error(err.message);
  }
  return { props: { post } };
}
