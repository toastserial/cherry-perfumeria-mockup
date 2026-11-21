import { Link } from "react-router-dom";
import type { Perfume } from "../types";
import { lowestPrice, money } from "../lib/format";
import { useCart } from "../store/CartContext";

export function PerfumeCard({
  perfume,
  onQuick,
  compact = false,
}: {
  perfume: Perfume;
  onQuick: (perfume: Perfume, element: HTMLElement) => void;
  compact?: boolean;
}) {
  const cart = useCart();
  const variant =
    perfume.variants.find((item) => item.stock > 0) ?? perfume.variants[0];
  const available = perfume.variants.some((item) => item.stock > 0);
  return (
    <article
      className={`perfume-card glossy-card ${compact ? "is-compact" : ""}`}
    >
      <div className="product-image">
        <img
          loading="lazy"
          src={perfume.image}
          alt={`Frasco de ${perfume.name}`}
        />
        <div className="card-overlay">
          <button onClick={(event) => onQuick(perfume, event.currentTarget)}>
            Vista rápida
          </button>
          <button
            disabled={!available}
            onClick={() => cart.add(perfume, variant)}
          >
            Agregar a bolsa
          </button>
        </div>
        {perfume.isNew && <span className="tag">Nuevo</span>}
      </div>
      <div className="card-info">
        <Link to={`/perfumes/${perfume.slug}`}>
          <span>{perfume.brand}</span>
          <h3>{perfume.name}</h3>
          <p>
            {perfume.concentration} · {perfume.family}
          </p>
        </Link>
        <div>
          <strong>Desde {money(lowestPrice(perfume.variants))}</strong>
          <small className={available ? "available" : "sold"}>
            {available ? "Disponible" : "Agotado"}
          </small>
        </div>
      </div>
    </article>
  );
}
