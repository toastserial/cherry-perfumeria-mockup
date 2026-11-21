import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../store/CartContext";

const links = [
  ["/", "Inicio"],
  ["/catalogo", "Catálogo"],
  ["/marcas", "Marcas"],
  ["/colecciones", "Colecciones"],
  ["/ofertas", "Ofertas"],
  ["/favoritos", "Favoritos"],
  ["/contacto", "Contacto"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [mega, setMega] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const cart = useCart();
  useEffect(() => {
    const onScroll = () => setCompact(scrollY > 24);
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  const move = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!matchMedia("(pointer:fine)").matches) return;
    const element = event.currentTarget,
      rect = element.getBoundingClientRect();
    element.style.setProperty(
      "--mx",
      `${(event.clientX - rect.left - rect.width / 2) * 0.08}px`,
    );
    element.style.setProperty(
      "--my",
      `${(event.clientY - rect.top - rect.height / 2) * 0.12}px`,
    );
  };
  const indicator = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      nav = navRef.current?.getBoundingClientRect();
    if (!nav) return;
    navRef.current?.style.setProperty("--nav-x", `${rect.left - nav.left}px`);
    navRef.current?.style.setProperty("--nav-w", `${rect.width}px`);
    navRef.current?.classList.add("has-indicator");
  };
  return (
    <header className={`navbar ${compact ? "is-compact" : ""}`}>
      <Link className="brand" to="/">
        <img src="/assets/logo.png" alt="" />
        <span>CHERRY</span>
      </Link>
      <nav
        ref={navRef}
        className="desktop-nav"
        aria-label="Navegación principal"
        onMouseLeave={() => navRef.current?.classList.remove("has-indicator")}
      >
        <i aria-hidden="true" />
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            onMouseMove={move}
            onMouseLeave={(event) => {
              event.currentTarget.style.setProperty("--mx", "0");
              event.currentTarget.style.setProperty("--my", "0");
            }}
            onMouseEnter={(event) => {
              indicator(event);
              setMega(label === "Catálogo" || label === "Marcas" ? label : "");
            }}
            onFocus={() =>
              setMega(label === "Catálogo" || label === "Marcas" ? label : "")
            }
          >
            {label}
          </NavLink>
        ))}
        {mega && (
          <div className="mega glossy-panel" onMouseLeave={() => setMega("")}>
            <p className="eyebrow">{mega}</p>
            <div>
              <Link to="/catalogo?family=Floral">Florales</Link>
              <Link to="/catalogo?family=Amaderado">Amaderados</Link>
              <Link to="/catalogo?family=Oriental%2F%C3%81mbar">Ámbar</Link>
              <Link to="/catalogo?news=1">Nuevos</Link>
            </div>
          </div>
        )}
      </nav>
      <div className="nav-actions">
        <Link
          className="nav-search"
          to="/catalogo"
          aria-label="Buscar fragancias"
        >
          <span aria-hidden="true" className="search-glyph" />
          <span>Buscar</span>
        </Link>
        <button
          className="cart-trigger"
          onClick={cart.open}
          aria-label={`Abrir bolsa de consulta, ${cart.count} productos`}
        >
          <span className="bag-glyph" aria-hidden="true" />
          {cart.count > 0 && <b>{cart.count}</b>}
          <span className="cart-label">Bolsa</span>
        </button>
        <button
          className={`menu-button ${open ? "is-open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          <span className="hamburger-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="menu-label">{open ? "Cerrar" : "Menú"}</span>
        </button>
      </div>
      <div
        className={`menu-scrim ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
      />
      <div
        id="mobile-menu"
        className={`mobile-nav glossy-panel ${open ? "is-open" : ""}`}
      >
        <div className="mobile-nav-head">
          <p>Cherry Perfumería</p>
          <span>{String(links.length).padStart(2, "0")} secciones</span>
        </div>
        <nav aria-label="Navegación móvil">
          {links.map(([to, label], index) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              {label}
              <i>→</i>
            </NavLink>
          ))}
        </nav>
        <div className="mobile-nav-foot">
          <button
            onClick={() => {
              setOpen(false);
              cart.open();
            }}
          >
            Ver bolsa <b>{cart.count}</b>
          </button>
          <Link to="/catalogo?q=" onClick={() => setOpen(false)}>
            Buscar perfume
          </Link>
        </div>
      </div>
    </header>
  );
}
