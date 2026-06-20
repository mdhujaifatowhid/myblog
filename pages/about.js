import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Hujaifa\'s Blog';
  return (
    <>
      <Head>
        <title>About Me — {siteName}</title>
        <meta name="description" content={`${siteName} — Learn more about us and why we write.`} />
      </Head>
      <Header />
      <div className="container simple-page">
        <h1>About Us</h1>
        <p>
         Hi! <br> I&#39;m Hujaifa. Welcome to this little corner of the internet where history, literature, cinema, and ideas come together. This blog is dedicated to exploring fascinating stories, timeless works, and thought-provoking topics through informative, fact-based, and unbiased writing. Whether you're here to learn something new or simply enjoy a good read, there's always something worth discovering.
        </p>
        <p>
          I try to keep this site simple, fast, and ad-free, so that readers can focus solely on the writing.
        </p>
      </div>
      <Footer />
    </>
  );
}
