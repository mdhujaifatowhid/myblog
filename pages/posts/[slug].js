import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CalendarIcon, ClockIcon, UserIcon } from '../../components/icons';
import { getAllPosts, getPostBySlug } from '../../lib/posts';

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function PostPage({ post, siteUrl, siteName }) {
  if (!post) return null;
  const url = `${siteUrl}/posts/${post.slug}`;

  return (
    <>
      <Head>
        <title>{post.title} — {siteName}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={url} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
        <meta property="article:published_time" content={post.date || ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: { '@type': 'Person', name: post.author },
              image: post.thumbnail || undefined,
              mainEntityOfPage: url,
              publisher: { '@type': 'Organization', name: siteName },
            }),
          }}
        />
      </Head>

      <Header />

      <article className="container post-detail">
        {post.thumbnail && (
          <div className="cover">
            <img src={post.thumbnail} alt={post.title} />
          </div>
        )}
        <h1>{post.title}</h1>
        <div className="meta">
          <span className="meta-item"><UserIcon /> {post.author}</span>
          <span className="meta-dot">&middot;</span>
          <span className="meta-item"><CalendarIcon /> {formatDate(post.date)}</span>
          <span className="meta-dot">&middot;</span>
          <span className="meta-item"><ClockIcon /> {post.readingTime} min read</span>
        </div>
        <div className="post-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  let posts = [];
  try {
    posts = await getAllPosts();
  } catch {
    posts = [];
  }
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  let post = null;
  try {
    post = await getPostBySlug(params.slug);
  } catch (err) {
    console.error(err.message);
  }
  if (!post) return { notFound: true, revalidate: 60 };
  return {
    props: {
      post,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Simple Blog',
    },
    revalidate: 60,
  };
}
