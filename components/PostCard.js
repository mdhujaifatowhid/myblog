import Link from 'next/link';

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link href={`/posts/${post.slug}`} className="thumb-wrap">
        {post.thumbnail ? (
          <img src={post.thumbnail} alt={post.title} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#e7e1d6' }} />
        )}
      </Link>
      <div className="body">
        <span className="post-date">&#128197; {formatDate(post.date)}</span>
        <h3>
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="post-excerpt">{post.excerpt}</p>
        <Link href={`/posts/${post.slug}`} className="read-more">
          Read More &rarr;
        </Link>
      </div>
    </article>
  );
}
