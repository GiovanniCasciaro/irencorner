import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <nav className="nav" aria-label="Navigazione principale">
        <Link className="logo" href="/" aria-label="Iren Canale Corner - Home">
          <Image
            src="/logo.jpg"
            alt="Iren Canale Corner — eNOVA Italia"
            width={220}
            height={124}
            className="logo-image"
            priority
          />
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
