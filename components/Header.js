import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Header({ onSearch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div ref={ref} style={{ position: 'relative' }}>
          <button className="menu-btn" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            &#8942;
          </button>
          {open && (
            <div className="dropdown-menu">
              <Link href="/about" onClick={() => setOpen(false)}>About Us</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
              <Link href="/admin/login" onClick={() => setOpen(false)}>Login as Admin</Link>
            </div>
          )}
        </div>

        <Link href="/" className="site-logo">Hujaifa/'s Blog</Link>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
          <span>&#128269;</span>
        </div>
      </div>
    </header>
  );
}
