import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Perfume } from "../types";
import { money } from "../lib/format";
import { useCart } from "../store/CartContext";

export function QuickView({
  perfume,
  onClose,
  returnFocus,
}: {
  perfume: Perfume | null;
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  const close = useRef<HTMLButtonElement>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const cart = useCart();
  useEffect(() => {
    setVariantIndex(0);
  }, [perfume?.id]);
  useEffect(() => {
    if (!perfume) return;
    close.current?.focus();
    const key = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", key);
      document.body.style.overflow = "";
      returnFocus?.focus();
    };
  }, [perfume, onClose, returnFocus]);
  if (!perfume) return null;
  const variant = perfume.variants[variantIndex] ?? perfume.variants[0];
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="quick-view glossy-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-title"
      >
        <button
          ref={close}
          className="close-button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="quick-image">
          <img src={perfume.image} alt="" />
        </div>
        <div className="quick-content">
          <p className="eyebrow">{perfume.brand}</p>
          <h2 id="quick-title">{perfume.name}</h2>
          <p className="price">{money(variant.salePrice ?? variant.price)}</p>
          <p>{perfume.description}</p>
          <dl>
            <div>
              <dt>Familia</dt>
              <dd>{perfume.family}</dd>
            </div>
            <div>
              <dt>Notas</dt>
              <dd>{perfume.notes.join(", ")}</dd>
            </div>
          </dl>
          <p className="eyebrow">Elige el tamaño</p>
          <div className="sizes">
            {perfume.variants.map((item, index) => (
              <button
                className={index === variantIndex ? "selected" : ""}
                onClick={() => setVariantIndex(index)}
                key={item.id}
                disabled={!item.stock}
              >
                {item.size} ml
                <small>
                  {item.stock ? money(item.salePrice ?? item.price) : "Agotado"}
                </small>
              </button>
            ))}
          </div>
          <div className="quick-actions">
            <button
              className="button button-dark"
              disabled={!variant.stock}
              onClick={() => {
                cart.add(perfume, variant);
                onClose();
              }}
            >
              Agregar a bolsa
            </button>
            <Link
              className="button button-light"
              to={`/perfumes/${perfume.slug}`}
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
