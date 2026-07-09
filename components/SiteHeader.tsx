import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <nav className="nav" aria-label="Navigazione principale">
        <Link className="logo" href="/" aria-label="Iren Corner - Home">
          <Image
            src="/favicon.ico"
            alt="Iren"
            width={108}
            height={36}
            className="logo-image"
            priority
          />
          <span className="brand-title">Corner</span>
        </Link>
        <div className="nav-actions">
          <a className="btn btn-primary btn-small" href="#candidatura">
            Compila il form
          </a>
        </div>
      </nav>
    </header>
  );
}
