import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { CartDrawer } from "./CartDrawer";
export function PublicLayout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="footer">
        <div>
          <img src="/assets/logo.png" alt="Cherry Perfumería" />
          <p>Perfumes que vas a querer usar todos los días.</p>
        </div>
        <div>
          <p className="eyebrow">Ayuda</p>
          <a href="/contacto">Contáctanos</a>
          <a href="/catalogo">Elegir una fragancia</a>
        </div>
        <div>
          <p className="eyebrow">Explora</p>
          <a href="/catalogo">Catálogo</a>
          <a href="/colecciones">Colecciones</a>
        </div>
        <small>© 2026 Cherry Perfumería</small>
      </footer>
      <CartDrawer />
    </div>
  );
}
