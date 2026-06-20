import { getSiteUrl } from '../lib/site';

export default function Robots() {
  return null;
}

export async function getServerSideProps({ res }) {
  const siteUrl = getSiteUrl();
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://hujaifa-towhid.vercel.app/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.write(body);
  res.end();
  return { props: {} };
}
