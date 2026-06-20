import Link from 'next/link';

function SocialIcon({ name }) {
  const icons = {
    twitter: (
      <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1c.5 1.6 2 2.8 3.8 2.9A8.2 8.2 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.2z" />
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="6.6" r="1.1" />
      </>
    ),
    linkedin: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7.5 9.5v7M7.5 6.7v.1M11 9.5v7M11 12.3c0-1.6 1.2-2.8 2.8-2.8 1.6 0 2.7 1.1 2.7 2.9v4.1" fill="none" stroke="#161412" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    facebook: (
      <path d="M14 21v-7h2.3l.4-2.7H14V9.5c0-.8.2-1.3 1.4-1.3h1.4V5.8c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2H9v2.7h2.2V21h2.8z" />
    ),
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">Hujaifa&#39;s<span>Blog</span></Link>
            <p>
              Short, honest writing on ideas, habits and everyday moments. Replace this
              line with your own one-sentence pitch.
            </p>
           <div className="footer-social">
  <a
    href="https://x.com/HujaifaTowhid"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Twitter / X"
  >
    <SocialIcon name="twitter" />
  </a>

  <a
    href="https://instagram.com/hujaifa.tired"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <SocialIcon name="instagram" />
  </a>

  <a
    href="https://www.facebook.com/md.hujaifa.towhid"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
  >
    <SocialIcon name="facebook" />
  </a>

  <a
    href="https://www.linkedin.com/in/hujaifa-towhid/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
  >
    <SocialIcon name="linkedin" />
  </a>
</div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <Link href="/">Lifestyle</Link>
            <Link href="/">Writing</Link>
            <Link href="/">Travel</Link>
          </div>

          <div className="footer-col footer-newsletter">
            <h4>Stay updated</h4>
            <p>Get new posts in your inbox. No spam, unsubscribe anytime.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@example.com" aria-label="Email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} Md Hujaifa Towhid. All rights reserved.</span>
          <div className="footer-legal">
            <Link href="/">Privacy Policy</Link>
            <Link href="/">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
