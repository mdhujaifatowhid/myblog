export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div>&copy; {year} Hujaifa/'s Blog. All rights reserved.</div>
      <div>Made with ❤ by Md Hujaifa Towhid</div>
    </footer>
  );
}
