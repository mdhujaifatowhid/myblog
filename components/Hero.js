import Link from 'next/link';

export default function Hero() {
  return (
    <div className="container">
      <section className="hero">
        <div>
          <h1>Welcome to my Blog</h1>
          <Link href="#posts" className="btn-black">Read Latest Posts</Link>
        </div>
      </section>
    </div>
  );
}
