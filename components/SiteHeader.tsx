import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <nav className="nav" aria-label="Navigazione principale">
        <Link className="logo" href="/" aria-label="Iren Corner - Home">
          <span className="logo-mark" aria-hidden="true" />
          <span className="brand-title">Iren Corner</span>
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
