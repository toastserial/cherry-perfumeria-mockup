import { Link } from "react-router-dom";
export function SimplePage({ title, text }: { title: string; text: string }) {
  return (
    <section className="simple-page">
      <p className="eyebrow">Cherry Perfumería</p>
      <h1>{title}</h1>
      <p>{text}</p>
      <Link className="button button-dark" to="/catalogo">
        Explorar catálogo
      </Link>
    </section>
  );
}
