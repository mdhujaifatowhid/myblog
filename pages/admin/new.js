import Head from 'next/head';
import { useRouter } from 'next/router';
import PostForm from '../../components/PostForm';
import { isValidSessionCookie } from '../../lib/auth';

export default function NewPost() {
  const router = useRouter();

  async function handleSubmit(values) {
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    router.push('/admin');
  }

  return (
    <>
      <Head><title>New Post — Admin</title></Head>
      <div className="admin-shell">
        <h1 style={{ fontSize: '1.6rem', marginBottom: 24 }}>New Post</h1>
        <PostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  if (!isValidSessionCookie(req.headers.cookie)) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
