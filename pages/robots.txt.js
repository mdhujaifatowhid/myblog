export default function Robots() {
  return null;
}

export async function getServerSideProps({ res }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.write(body);
  res.end();
  return { props: {} };
}
