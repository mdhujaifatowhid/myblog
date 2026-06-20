import Link from 'next/link';

export default function Hero() {
  return (
    <div className="container">
      <section className="hero">
        <div>
          <h1>Welcome to my Blog</h1>
          <Link href="#posts" className="btn-black">Read Latest Posts</Link>
        </div>
        <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="20" y="40" width="220" height="160" rx="10" fill="#fff" stroke="#161412" strokeWidth="2.5" />
          <line x1="130" y1="48" x2="130" y2="192" stroke="#161412" strokeWidth="2" />
          <path d="M70 100 Q90 80 90 100 L90 150 Q90 130 70 150" stroke="#161412" strokeWidth="1.5" fill="none" />
          <circle cx="320" cy="90" r="36" fill="#fff" stroke="#161412" strokeWidth="2.5" />
          <path d="M300 95 h40 v18 a20 20 0 0 1 -40 0z" fill="#fff" stroke="#161412" strokeWidth="2.5" />
          <path d="M340 100 q14 2 14 14 q0 14 -14 12" stroke="#161412" strokeWidth="2.5" fill="none" />
          <path d="M250 200 l60 -55" stroke="#161412" strokeWidth="3" strokeLinecap="round" />
          <path d="M330 180 Q345 165 345 145" stroke="#161412" strokeWidth="1.5" fill="none" />
        </svg>
      </section>
    </div>
  );
}
