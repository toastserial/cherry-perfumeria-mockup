import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PerfumeCard } from "../components/PerfumeCard";
import { QuickView } from "../components/QuickView";
import { brands, families } from "../data/perfumes";
import {
  defaultFilters,
  filterPerfumes,
  type CatalogFilters,
} from "../lib/catalog";
import type { Perfume } from "../types";
import { usePerfumes } from "../services/perfumes";
const take = (sp: URLSearchParams, key: string) =>
  sp
    .getAll(key)
    .flatMap((v) => v.split(","))
    .filter(Boolean);
const fromUrl = (sp: URLSearchParams, preset?: string): CatalogFilters => ({
  ...defaultFilters,
  q: sp.get("q") || "",
  brand: take(sp, "brand"),
  family: take(sp, "family"),
  gender: take(sp, "gender"),
  concentration: take(sp, "concentration"),
  min: Number(sp.get("min")) || 0,
  max: Number(sp.get("max")) || 10000,
  available: sp.get("available") === "1",
  news: sp.get("news") === "1",
  offers: preset === "offers" || sp.get("offers") === "1",
  collection: sp.get("collection") || "",
  sort: sp.get("sort") || "relevancia",
});
export function CatalogPage({ preset }: { preset?: string }) {
  const [params, setParams] = useSearchParams(),
    [filters, setFilters] = useState(() => fromUrl(params, preset)),
    [page, setPage] = useState(1),
    [view, setView] = useState<"grid" | "compact" | "list">("grid"),
    [drawer, setDrawer] = useState(false),
    [quick, setQuick] = useState<Perfume | null>(null),
    [focus, setFocus] = useState<HTMLElement | null>(null);
  const { data: products = [] } = usePerfumes();
  useEffect(() => setFilters(fromUrl(params, preset)), [params, preset]);
  const results = useMemo(
    () => filterPerfumes(products, filters),
    [products, filters],
  );
  const pages = Math.max(1, Math.ceil(results.length / 6)),
    shown = results.slice((page - 1) * 6, page * 6);
  const update = (next: Partial<CatalogFilters>) => {
    const f = { ...filters, ...next };
    setFilters(f);
    setPage(1);
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    for (const key of ["brand", "family", "gender", "concentration"] as const)
      f[key].forEach((v) => p.append(key, v));
    if (f.min) p.set("min", String(f.min));
    if (f.max < 10000) p.set("max", String(f.max));
    if (f.available) p.set("available", "1");
    if (f.news) p.set("news", "1");
    if (f.offers) p.set("offers", "1");
    if (f.collection) p.set("collection", f.collection);
    if (f.sort !== "relevancia") p.set("sort", f.sort);
    setParams(p, { replace: true });
  };
  const toggle = (
    key: "brand" | "family" | "gender" | "concentration",
    value: string,
  ) =>
    update({
      [key]: filters[key].includes(value)
        ? filters[key].filter((x) => x !== value)
        : [...filters[key], value],
    });
  const chips = [
    ...filters.brand,
    ...filters.family,
    ...filters.gender,
    ...filters.concentration,
    filters.available ? "Disponibles" : "",
    filters.news ? "Novedades" : "",
    filters.offers ? "Ofertas" : "",
  ].filter(Boolean);
  const Filters = () => (
    <div className="filters">
      <div className="filter-head">
        <h2>Filtrar</h2>
        <button
          onClick={() =>
            update({ ...defaultFilters, offers: preset === "offers" })
          }
        >
          Limpiar
        </button>
      </div>
      <FilterGroup
        title="Marca"
        values={brands}
        selected={filters.brand}
        onToggle={(v) => toggle("brand", v)}
      />
      <FilterGroup
        title="Familia olfativa"
        values={families}
        selected={filters.family}
        onToggle={(v) => toggle("family", v)}
      />
      <FilterGroup
        title="Género"
        values={["Femenino", "Masculino", "Unisex"]}
        selected={filters.gender}
        onToggle={(v) => toggle("gender", v)}
      />
      <FilterGroup
        title="Concentración"
        values={["EDT", "EDP", "Parfum"]}
        selected={filters.concentration}
        onToggle={(v) => toggle("concentration", v)}
      />
      <fieldset>
        <legend>Precio máximo</legend>
        <input
          aria-label="Precio máximo"
          type="range"
          min="1000"
          max="5000"
          step="250"
          value={Math.min(filters.max, 5000)}
          onChange={(e) => update({ max: Number(e.target.value) })}
        />
        <output>L {Math.min(filters.max, 5000).toLocaleString("es-HN")}</output>
      </fieldset>
      <label className="check">
        <input
          type="checkbox"
          checked={filters.available}
          onChange={(e) => update({ available: e.target.checked })}
        />
        <span />
        Solo disponibles
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={filters.news}
          onChange={(e) => update({ news: e.target.checked })}
        />
        <span />
        Novedades
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={filters.offers}
          onChange={(e) => update({ offers: e.target.checked })}
        />
        <span />
        Ofertas
      </label>
    </div>
  );
  return (
    <section className="catalog-page">
      <header className="catalog-hero">
        <p className="eyebrow">La colección completa</p>
        <h1>
          Encuentra algo que se sienta <em>tuyo.</em>
        </h1>
        <div className="search-box">
          <span className="search-glyph" />
          <input
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Busca por nombre, marca, familia o nota"
            aria-label="Buscar fragancias"
          />
          <kbd>Buscar</kbd>
        </div>
      </header>
      <div className="catalog-mobile-bar">
        <button onClick={() => setDrawer(true)}>
          Filtros {chips.length ? `(${chips.length})` : ""}
        </button>
        <span>{results.length} resultados</span>
      </div>
      {chips.length > 0 && (
        <div className="active-chips">
          {chips.map((c) => (
            <span key={c}>{c}</span>
          ))}
          <button
            onClick={() =>
              update({ ...defaultFilters, offers: preset === "offers" })
            }
          >
            Quitar todos
          </button>
        </div>
      )}
      <div className="catalog-layout">
        <aside className="filter-sidebar">
          <Filters />
        </aside>
        <div className="results">
          <div className="results-toolbar">
            <p>
              <strong>{results.length}</strong> fragancias encontradas
            </p>
            <div className="view-controls" aria-label="Vista">
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
              >
                Editorial
              </button>
              <button
                className={view === "compact" ? "active" : ""}
                onClick={() => setView("compact")}
              >
                Compacta
              </button>
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
              >
                Lista
              </button>
            </div>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              aria-label="Ordenar"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="recientes">Más recientes</option>
              <option value="alfabetico">Alfabético</option>
            </select>
          </div>
          {shown.length ? (
            <div className={`catalog-grid view-${view}`}>
              {shown.map((p) => (
                <PerfumeCard
                  key={p.id}
                  perfume={p}
                  compact={view !== "grid"}
                  onQuick={(x, e) => {
                    setQuick(x);
                    setFocus(e);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No encontramos coincidencias</h2>
              <p>Prueba una búsqueda más amplia o elimina algunos filtros.</p>
              <button
                className="button button-dark"
                onClick={() => update(defaultFilters)}
              >
                Limpiar filtros
              </button>
            </div>
          )}
          <nav className="pagination" aria-label="Paginación">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ← Anterior
            </button>
            <span>
              Página {page} de {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente →
            </button>
          </nav>
        </div>
      </div>
      {drawer && (
        <div className="filter-drawer">
          <button
            className="close-button"
            onClick={() => setDrawer(false)}
            aria-label="Cerrar"
          >
            ×
          </button>
          <Filters />
          <button
            className="button button-dark drawer-apply"
            onClick={() => setDrawer(false)}
          >
            Ver {results.length} resultados
          </button>
        </div>
      )}
      <QuickView
        perfume={quick}
        onClose={() => setQuick(null)}
        returnFocus={focus}
      />
    </section>
  );
}
function FilterGroup({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend>{title}</legend>
      {values.map((v) => (
        <label className="check" key={v}>
          <input
            type="checkbox"
            checked={selected.includes(v)}
            onChange={() => onToggle(v)}
          />
          <span />
          {v}
        </label>
      ))}
    </fieldset>
  );
}
