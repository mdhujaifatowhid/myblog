import { getAllPosts } from '../lib/posts';

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  let posts = [];
  try {
    posts = await getAllPosts();
  } catch {
    posts = [];
  }

  const staticUrls = ['', '/about', '/contact'];
  const urls = [
    ...staticUrls.map((p) => `${siteUrl}${p}`),
    ...posts.map((p) => `${siteUrl}/posts/${p.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();

  return { props: {} };
}
