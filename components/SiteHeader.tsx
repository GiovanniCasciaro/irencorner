import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <nav className="nav" aria-label="Navigazione principale">
        <Link className="logo" href="/" aria-label="Iren eNOVA Italia - Home">
          <Image
            src="/logo.jpg"
            alt="Iren — eNOVA Italia"
            width={360}
            height={86}
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
