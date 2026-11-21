import { useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { PerfumeCard } from "../components/PerfumeCard";
import { QuickView } from "../components/QuickView";
import { ScentCarousel } from "../components/ScentCarousel";
import type { Perfume } from "../types";
import { usePerfumes } from "../services/perfumes";
export function HomePage() {
  const { data: all = [] } = usePerfumes();
  const products = all
    .filter((p) => p.status === "publicado" && p.featured)
    .slice(0, 4);
  const [quick, setQuick] = useState<Perfume | null>(null),
    [focus, setFocus] = useState<HTMLElement | null>(null);
  return (
    <>
      <Hero />
      <section className="intro">
        <p className="eyebrow">Encuentra el indicado</p>
        <p className="intro-quote">
          Elige por aroma, compara opciones y <em>guarda tus favoritas.</em>
        </p>
        <p>
          Usa los filtros para llegar rápido a lo que te gusta. Cuando tengas tu
          selección, envíala completa por WhatsApp.
        </p>
      </section>
      <ScentCarousel />
      <section className="featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Los más buscados</p>
            <h2>Selección Cherry</h2>
          </div>
          <Link className="text-link" to="/catalogo">
            Ver catálogo completo
          </Link>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <PerfumeCard
              key={p.id}
              perfume={p}
              onQuick={(x, e) => {
                setQuick(x);
                setFocus(e);
              }}
            />
          ))}
        </div>
      </section>
      <section className="editorial-banner">
        <div>
          <p className="eyebrow">¿No sabes cuál elegir?</p>
          <h2>Busca por las notas que ya te gustan.</h2>
          <p>
            Filtra por familia, concentración y precio. También puedes armar una
            bolsa y enviarnos todas tus opciones juntas.
          </p>
          <Link className="button button-light" to="/contacto">
            Buscar perfumes
          </Link>
        </div>
        <img
          loading="lazy"
          src="/assets/perfume-amber.png"
          alt="Frasco de perfume ámbar"
        />
      </section>
      <QuickView
        perfume={quick}
        onClose={() => setQuick(null)}
        returnFocus={focus}
      />
    </>
  );
}
