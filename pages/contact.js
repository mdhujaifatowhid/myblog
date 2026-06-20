import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Hujaifa\'s Blog';
  return (
    <>
      <Head>
        <title>Contact — {siteName}</title>
        <meta name="description" content={`${siteName}- Contact Information`} />
      </Head>
      <Header />
      <div className="container simple-page">
        <h1>Contact</h1>
        <p>Feel free to reach out to me at any time!</p>
        <p>
          <a href="mailto:mailtohujaifa@gmail.com" style={{ fontWeight: 700 }}>hello@example.com</a>
        </p>
        <p>I'll try to get back to you as soon as possible.</p>
      </div>
      <Footer />
    </>
  );
}
