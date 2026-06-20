import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="4" r="1.6" fill="currentColor" />
      <circle cx="10" cy="10" r="1.6" fill="currentColor" />
      <circle cx="10" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ref = useRef(null);
  const lastY = useRef(0);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }

    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const diff = y - lastY.current;

      setScrolled(y > 8);

      // ignore tiny jitters; only react past a small threshold
      if (Math.abs(diff) > 6) {
        if (diff > 0 && y > 80) {
          setHidden(true); // scrolling down -> hide
          setOpen(false);
        } else {
          setHidden(false); // scrolling up -> reveal
        }
        lastY.current = y;
      }

      // always show header again once back near the top
      if (y < 80) setHidden(false);
    }

    document.addEventListener('mousedown', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <div className="site-header-inner">
        <div ref={ref} className="menu-wrap">
          <button
            className="menu-btn"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <MenuIcon />
          </button>
          {open && (
            <div className="dropdown-menu" role="menu">
              <Link href="/about" onClick={() => setOpen(false)}>About Us</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
              <div className="dropdown-divider" />
              <Link href="/admin/login" onClick={() => setOpen(false)}>Login as Admin</Link>
            </div>
          )}
        </div>

        <Link href="/" className="site-logo">
          Hujaifa&#39;s <span>Blog</span>
        </Link>

        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search posts..."
            aria-label="Search posts"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
