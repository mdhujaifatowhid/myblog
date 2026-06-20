import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Hujaifa\'s Blog';
  return (
    <>
      <Head>
        <title>About Us — {siteName}</title>
        <meta name="description" content={`${siteName} — Learn more about us and why we write.`} />
      </Head>
      <Header />
      <div className="container simple-page">
        <h1>About Us</h1>
        <p>
          Welcome to {siteName}! I am passionate writers who love sharing our thoughts, ideas and stories on writing, mindfulness, travel and everyday life.
        </p>
        <p>
          I try to keep this site simple, fast, and ad-free, so that readers can focus solely on the writing.
        </p>
      </div>
      <Footer />
    </>
  );
}
