import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
      });
      gsap.to(".hero-photo", {
        yPercent: 8,
        scale: 1.04,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
      gsap.to(".hero-copy", {
        yPercent: -12,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  const parallax = (e: React.MouseEvent) => {
    if (
      matchMedia("(pointer:coarse), (prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = root.current!.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(".hero-photo", {
      x: x * 16,
      y: y * 10,
      rotateY: x * 2,
      rotateX: -y * 2,
      duration: 1.2,
      ease: "power3.out",
    });
    gsap.to(".hero-orb", {
      x: -x * 24,
      y: -y * 18,
      duration: 1.5,
      ease: "power3.out",
    });
  };
  return (
    <section ref={root} className="hero" onMouseMove={parallax}>
      <div className="hero-orb" />
      <div className="hero-glass" />
      <img
        className="hero-photo"
        src="/assets/hero-cherry.png"
        alt="Frasco de perfume de cristal rosa en un estudio de luz cálida"
      />
      <div className="hero-copy">
        <p className="eyebrow">Perfumes para encontrar tu favorito</p>
        <h1>
          Encuentra tu
          <br />
          próxima <em>esencia</em>
        </h1>
        <p className="hero-lede">
          Explora por aroma, descubre nuevas opciones y consulta tus favoritas
          en un solo mensaje.
        </p>
        <div className="hero-actions">
          <Link className="button button-dark" to="/catalogo">
            Ver perfumes
          </Link>
          <Link className="text-link" to="/catalogo?family=Floral">
            Elegir por aroma
          </Link>
        </div>
      </div>
      <div className="hero-caption">
        <span>Favoritos Cherry</span>
        <b>01</b>
      </div>
    </section>
  );
}
