import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { money } from "../lib/format";
import { usePerfumes } from "../services/perfumes";
import { useCart } from "../store/CartContext";

export function CartDrawer() {
  const cart = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data: products = [] } = usePerfumes();
  const suggestions = useMemo(() => {
    const ids = new Set(cart.items.map((item) => item.perfumeId));
    const families = new Set(cart.items.map((item) => item.family));
    return products
      .filter(
        (product) =>
          !ids.has(product.id) &&
          (families.has(product.family) || product.featured),
      )
      .slice(0, 3);
  }, [cart.items, products]);
  useEffect(() => {
    if (!cart.isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && cart.close();
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cart.isOpen]);
  if (!cart.isOpen) return null;
  const lines = cart.items.map(
    (item) =>
      `- ${item.brand} ${item.name}, ${item.variant.size} ml x ${item.quantity} — ${money((item.variant.salePrice ?? item.variant.price) * item.quantity)}`,
  );
  const message = encodeURIComponent(
    `Hola, quiero consultar esta selección:\n\n${lines.join("\n")}\n\nSubtotal estimado: ${money(cart.subtotal)}\n¿Me confirman disponibilidad, por favor?`,
  );
  return (
    <div
      className="cart-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && cart.close()
      }
    >
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <header className="cart-header">
          <div>
            <p className="eyebrow">Tu selección</p>
            <h2 id="cart-title">Bolsa de consulta</h2>
          </div>
          <button
            ref={closeRef}
            className="close-button"
            onClick={cart.close}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>
        <div className="cart-body">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <span className="bag-shape" />
              <h3>Tu bolsa está vacía</h3>
              <p>Agrega tus favoritos y consúltalos juntos por WhatsApp.</p>
              <Link
                className="button button-dark"
                to="/catalogo"
                onClick={cart.close}
              >
                Ver fragancias
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item) => (
                  <article className="cart-item" key={item.key}>
                    <Link to={`/perfumes/${item.slug}`} onClick={cart.close}>
                      <img src={item.image} alt="" />
                    </Link>
                    <div>
                      <span>{item.brand}</span>
                      <h3>{item.name}</h3>
                      <p>
                        {item.variant.size} ml ·{" "}
                        {money(item.variant.salePrice ?? item.variant.price)}
                      </p>
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            cart.quantity(item.key, item.quantity - 1)
                          }
                          aria-label="Restar uno"
                        >
                          −
                        </button>
                        <output>{item.quantity}</output>
                        <button
                          onClick={() =>
                            cart.quantity(item.key, item.quantity + 1)
                          }
                          aria-label="Agregar uno"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => cart.remove(item.key)}
                    >
                      Quitar
                    </button>
                  </article>
                ))}
              </div>
              {suggestions.length > 0 && (
                <section className="cart-related">
                  <div>
                    <p className="eyebrow">Combina con</p>
                    <span>Según tu selección</span>
                  </div>
                  <div className="related-strip">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => cart.add(product)}
                      >
                        <img src={product.image} alt="" />
                        <span>{product.name}</span>
                        <small>Agregar +</small>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
        {cart.items.length > 0 && (
          <footer className="cart-summary">
            <div>
              <span>Subtotal estimado</span>
              <strong>{money(cart.subtotal)}</strong>
            </div>
            <p>
              Confirmaremos disponibilidad y precio final antes de coordinar tu
              pedido.
            </p>
            <a
              className="whatsapp-button"
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "50400000000"}?text=${message}`}
              target="_blank"
              rel="noreferrer"
            >
              Enviar selección por WhatsApp <span>→</span>
            </a>
            <button className="clear-cart" onClick={cart.clear}>
              Vaciar bolsa
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
