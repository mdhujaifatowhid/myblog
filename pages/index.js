import { useMemo, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../lib/posts';

const PAGE_SIZE = 10;

export default function Home({ posts, siteUrl, siteName }) {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('all');
  const [month, setMonth] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const years = useMemo(() => {
    const set = new Set(posts.map((p) => (p.date ? new Date(p.date).getFullYear() : null)).filter(Boolean));
    return Array.from(set).sort((a, b) => b - a);
  }, [posts]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (search && !(`${p.title} ${p.excerpt}`.toLowerCase().includes(search.toLowerCase()))) {
        return false;
      }
      if (year !== 'all' && p.date && new Date(p.date).getFullYear() !== Number(year)) return false;
      if (month !== 'all' && p.date && months[new Date(p.date).getMonth()] !== month) return false;
      return true;
    });
  }, [posts, search, year, month]);

  const shown = filtered.slice(0, visible);

  const filterLabel =
    year !== 'all' || month !== 'all'
      ? `Showing posts from ${month !== 'all' ? month + ' ' : ''}${year !== 'all' ? year : ''}`
      : `Showing all ${filtered.length} posts`;

  const description = 'Simple Blog — thoughts, ideas and stories on writing, mindfulness, travel and everyday life.';

  return (
    <>
      <Head>
        <title>{siteName} — Thoughts, Ideas & Stories</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${siteName} — Thoughts, Ideas & Stories`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: siteName,
              url: siteUrl,
            }),
          }}
        />
      </Head>

      <Header onSearch={setSearch} />
      <Hero />

      <div className="container" id="posts">
        <div className="filter-bar">
          <div className="filter-left">
            <select className="filter-select" value={year} onChange={(e) => { setYear(e.target.value); setVisible(PAGE_SIZE); }}>
              <option value="all">All Years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="filter-select" value={month} onChange={(e) => { setMonth(e.target.value); setVisible(PAGE_SIZE); }}>
              <option value="all">All Months</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <span className="filter-note">{filterLabel}</span>
        </div>

        <div className="post-grid">
          {shown.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>

        {shown.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b665f', margin: '40px 0' }}>
            Post not found
          </p>
        )}

        {visible < filtered.length && (
          <div className="load-more-wrap">
            <button className="btn-black" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load More Posts
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  let posts = [];
  try {
    posts = await getAllPosts();
  } catch (err) {
    console.error('Failed to load posts:', err.message);
  }
  return {
    props: {
      posts,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Simple Blog',
    },
    revalidate: 60,
  };
}
