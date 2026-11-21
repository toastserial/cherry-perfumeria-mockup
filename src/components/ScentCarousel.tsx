import { useRef } from "react";
import { Link } from "react-router-dom";
import { families, demoPerfumes } from "../data/perfumes";
const mood = [
  "Pétalos limpios y luminosos",
  "Suave, goloso y reconfortante",
  "Profundo, seco y elegante",
  "Radiante y lleno de energía",
  "Cálido, resinoso y sensual",
  "Aire limpio sobre la piel",
  "Delicioso y envolvente",
  "Verde, herbal y sereno",
];
export function ScentCarousel() {
  const rail = useRef<HTMLDivElement>(null);
  return (
    <section className="scent-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Elige por sensación</p>
          <h2>Descubre tu esencia</h2>
        </div>
        <div className="carousel-controls">
          <button
            aria-label="Anterior"
            onClick={() =>
              rail.current?.scrollBy({ left: -360, behavior: "smooth" })
            }
          >
            ←
          </button>
          <button
            aria-label="Siguiente"
            onClick={() =>
              rail.current?.scrollBy({ left: 360, behavior: "smooth" })
            }
          >
            →
          </button>
        </div>
      </div>
      <div ref={rail} className="scent-rail">
        {families.map((f, i) => (
          <Link
            key={f}
            to={`/catalogo?family=${encodeURIComponent(f)}`}
            className={`scent-card scent-${i}`}
          >
            <span>0{i + 1}</span>
            <div>
              <h3>{f}</h3>
              <p>{mood[i]}</p>
              <small>
                {demoPerfumes.filter((p) => p.family === f).length} fragancias
              </small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
