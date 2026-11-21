import { Link } from "react-router-dom";
const items = [
  ["Selección Cherry", "Nuestros perfumes recomendados.", "Selección Cherry"],
  ["Nuevos ingresos", "Los perfumes que acaban de llegar.", "Nuevos ingresos"],
  ["Los más vendidos", "Fragancias que dejan huella.", "Más vendidos"],
  [
    "Ediciones especiales",
    "Piezas singulares para descubrir.",
    "Ediciones especiales",
  ],
];
export function CollectionsPage() {
  return (
    <section className="collections-page">
      <header>
        <p className="eyebrow">Explora por colección</p>
        <h1>
          Encuentra perfumes para cada <em>ocasión.</em>
        </h1>
      </header>
      <div className="collection-grid">
        {items.map((x, i) => (
          <Link
            key={x[0]}
            to={`/catalogo?collection=${encodeURIComponent(x[2])}`}
            className={`collection-tile tile-${i}`}
          >
            <span>0{i + 1}</span>
            <div>
              <h2>{x[0]}</h2>
              <p>{x[1]}</p>
              <b>Explorar →</b>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
