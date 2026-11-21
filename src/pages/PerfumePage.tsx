import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { money } from "../lib/format";
import { usePerfumes } from "../services/perfumes";
import { useCart } from "../store/CartContext";
export function PerfumePage() {
  const { slug } = useParams();
  const { data: products = [] } = usePerfumes();
  const cart = useCart();
  const p = products.find((x) => x.slug === slug),
    [selected, setSelected] = useState(0);
  const related = useMemo(
    () =>
      products
        .filter((x) => x.family === p?.family && x.id !== p?.id)
        .slice(0, 3),
    [p, products],
  );
  if (!p)
    return (
      <section className="simple-page">
        <h1>Fragancia no encontrada</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </section>
    );
  const v = p.variants[selected] ?? p.variants[0];
  return (
    <article className="detail-page">
      <section className="product-hero">
        <div className="product-gallery">
          <span className="gallery-index">01 / 01</span>
          <img src={p.image} alt={`Frasco de ${p.name}`} />
        </div>
        <div className="product-summary">
          <Link className="back-link" to="/catalogo">
            ← Volver al catálogo
          </Link>
          <p className="eyebrow">{p.brand}</p>
          <h1>{p.name}</h1>
          <p className="detail-sub">
            {p.concentration} · {p.family}
          </p>
          <p className="detail-price">{money(v.salePrice ?? v.price)}</p>
          <div className="variant-list" role="radiogroup" aria-label="Tamaño">
            <p>Elige tu presentación</p>
            {p.variants.map((x, i) => (
              <button
                role="radio"
                aria-checked={selected === i}
                className={selected === i ? "selected" : ""}
                key={x.id}
                onClick={() => setSelected(i)}
              >
                <span>{x.size} ml</span>
                <strong>{money(x.salePrice ?? x.price)}</strong>
                <small>{x.stock ? "Disponible" : "Agotado"}</small>
              </button>
            ))}
          </div>
          <button
            className="button button-dark full"
            disabled={!v.stock}
            onClick={() => cart.add(p, v)}
          >
            Agregar a la bolsa
          </button>
          <button className="button button-light full">
            Agregar a favoritos
          </button>
        </div>
      </section>
      <section className="story-section">
        <div>
          <p className="eyebrow">Cómo huele</p>
          <h2>Conoce sus notas de principio a fin.</h2>
        </div>
        <p>
          {p.description} Revisa las notas de salida, corazón y fondo para saber
          si encaja con lo que estás buscando.
        </p>
      </section>
      <section className="pyramid">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Notas del perfume</p>
            <h2>Pirámide olfativa</h2>
          </div>
          <p>{p.accords.join(" · ")}</p>
        </div>
        <div className="pyramid-stack">
          <div>
            <span>Salida</span>
            <strong>{p.top.join(" · ")}</strong>
          </div>
          <div>
            <span>Corazón</span>
            <strong>{p.heart.join(" · ")}</strong>
          </div>
          <div>
            <span>Fondo</span>
            <strong>{p.base.join(" · ")}</strong>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="related">
          <p className="eyebrow">En la misma familia</p>
          <h2>También podría gustarte</h2>
          <div>
            {related.map((x) => (
              <Link to={`/perfumes/${x.slug}`} key={x.id}>
                <img src={x.image} alt="" />
                <span>{x.brand}</span>
                <h3>{x.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
