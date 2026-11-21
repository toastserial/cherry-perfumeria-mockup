import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { isDemoMode, supabase } from "../lib/supabase";
import { readPerfumes, writePerfumes } from "../store/catalogStore";
import type { Perfume } from "../types";
import { money } from "../lib/format";
import {
  savePerfume,
  updatePerfumeStatus,
  usePerfumes,
} from "../services/perfumes";

const schema = z.object({
  name: z.string().min(2, "Escribe un nombre"),
  brand: z.string().min(2, "Escribe una marca"),
  family: z.string().min(2),
  gender: z.enum(["Femenino", "Masculino", "Unisex"]),
  concentration: z.string().min(2),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  description: z.string().min(20, "Incluye al menos 20 caracteres"),
  status: z.enum(["publicado", "borrador"]),
});
type FormData = z.output<typeof schema>;
type FormInput = z.input<typeof schema>;
const blank: FormData = {
  name: "",
  brand: "",
  family: "Floral",
  gender: "Unisex",
  concentration: "EDP",
  price: 2000,
  stock: 5,
  description: "Una nueva composición seleccionada por Cherry Perfumería.",
  status: "borrador",
};
export function AdminPage() {
  const queryClient = useQueryClient();
  const [authed, setAuthed] = useState(isDemoMode),
    [loginError, setLoginError] = useState(""),
    [syncError, setSyncError] = useState(""),
    [items, setItems] = useState<Perfume[]>(readPerfumes),
    [editing, setEditing] = useState<Perfume | null>(null),
    [formOpen, setFormOpen] = useState(false),
    [section, setSection] = useState("Perfumes");
  const { data: remoteItems } = usePerfumes(true, authed);
  useEffect(() => {
    if (!isDemoMode && remoteItems) setItems(remoteItems);
  }, [remoteItems]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: blank,
  });
  const metrics = useMemo(
    () => ({
      total: items.length,
      published: items.filter((x) => x.status === "publicado").length,
      drafts: items.filter((x) => x.status === "borrador").length,
      low: items.filter((x) =>
        x.variants.some((v) => v.stock > 0 && v.stock <= 4),
      ).length,
      out: items.filter((x) => x.variants.every((v) => v.stock === 0)).length,
    }),
    [items],
  );
  const persist = (next: Perfume[]) => {
    setItems(next);
    writePerfumes(next);
  };
  const submit = async (data: FormData) => {
    const slug = data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const next: Perfume = {
      id: editing?.id ?? crypto.randomUUID(),
      slug,
      name: data.name,
      brand: data.brand,
      family: data.family,
      gender: data.gender,
      concentration: data.concentration,
      description: data.description,
      notes: editing?.notes ?? ["Bergamota", "Rosa", "Almizcle"],
      top: editing?.top ?? ["Bergamota"],
      heart: editing?.heart ?? ["Rosa"],
      base: editing?.base ?? ["Almizcle"],
      accords: editing?.accords ?? [data.family],
      image: editing?.image ?? "/assets/perfume-rose.png",
      collection: editing?.collection ?? "Nuevos ingresos",
      status: data.status,
      variants: [
        {
          id: editing?.variants[0]?.id ?? crypto.randomUUID(),
          size: 50,
          price: data.price,
          stock: data.stock,
        },
      ],
      featured: editing?.featured ?? false,
      isNew: editing?.isNew ?? true,
    };
    const updated = editing
      ? items.map((x) => (x.id === editing.id ? next : x))
      : [next, ...items];
    persist(updated);
    try {
      await savePerfume(next);
      await queryClient.invalidateQueries({ queryKey: ["perfumes"] });
    } catch {
      setSyncError("No fue posible sincronizar el cambio con Supabase.");
    }
    setFormOpen(false);
    setEditing(null);
    reset(blank);
  };
  const toggleStatus = async (p: Perfume) => {
    const status = p.status === "publicado" ? "borrador" : "publicado";
    persist(items.map((x) => (x.id === p.id ? { ...x, status } : x)));
    try {
      await updatePerfumeStatus(p.id, status);
      await queryClient.invalidateQueries({ queryKey: ["perfumes"] });
    } catch {
      setSyncError("No fue posible cambiar el estado en Supabase.");
    }
  };
  const edit = (p: Perfume) => {
    setEditing(p);
    const v = p.variants[0];
    reset({
      name: p.name,
      brand: p.brand,
      family: p.family,
      gender: p.gender,
      concentration: p.concentration,
      price: v.price,
      stock: v.stock,
      description: p.description,
      status: p.status,
    });
    setFormOpen(true);
  };
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget),
      email = String(fd.get("email")),
      password = String(fd.get("password"));
    const result = await supabase?.auth.signInWithPassword({ email, password });
    if (result?.error)
      setLoginError(
        "No fue posible iniciar sesión. Verifica tus credenciales.",
      );
    else setAuthed(true);
  };
  if (!authed)
    return (
      <main className="admin-login">
        <Link to="/" className="brand">
          <img src="/assets/logo.png" alt="" />
          <span>CHERRY</span>
        </Link>
        <form onSubmit={login}>
          <p className="eyebrow">Administración privada</p>
          <h1>Bienvenido de nuevo</h1>
          <label>
            Correo
            <input name="email" type="email" required />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" required />
          </label>
          {loginError && <p className="form-error">{loginError}</p>}
          <button className="button button-dark">Ingresar</button>
        </form>
      </main>
    );
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand">
          <img src="/assets/logo.png" alt="" />
          <span>CHERRY</span>
        </Link>
        <nav>
          {[
            "Resumen",
            "Perfumes",
            "Marcas",
            "Colecciones",
            "Inventario",
            "Personalización",
          ].map((x) => (
            <button
              key={x}
              className={section === x ? "active" : ""}
              onClick={() => setSection(x)}
            >
              {x}
            </button>
          ))}
        </nav>
        <Link to="/">← Volver a la tienda</Link>
      </aside>
      <section className="admin-content">
        {isDemoMode && (
          <div className="demo-banner">
            <strong>Modo demo</strong>
            <span>
              Los cambios se guardan solo en este navegador. Añade credenciales
              de Supabase para activar el entorno real.
            </span>
          </div>
        )}
        {syncError && <p className="form-error">{syncError}</p>}
        <header className="admin-header">
          <div>
            <p className="eyebrow">Panel administrativo</p>
            <h1>{section}</h1>
          </div>
          <button
            className="button button-dark"
            onClick={() => {
              setEditing(null);
              reset(blank);
              setFormOpen(true);
            }}
          >
            Nuevo perfume
          </button>
        </header>
        {section === "Resumen" ? (
          <>
            <div className="metrics">
              <Metric label="Fragancias" value={metrics.total} />
              <Metric label="Publicadas" value={metrics.published} />
              <Metric label="Borradores" value={metrics.drafts} />
              <Metric label="Stock bajo" value={metrics.low} />
              <Metric label="Agotadas" value={metrics.out} />
            </div>
            <div className="admin-panel">
              <h2>Atención requerida</h2>
              <p>
                {metrics.low + metrics.out} productos necesitan revisión de
                inventario.
              </p>
              <button onClick={() => setSection("Inventario")}>
                Revisar inventario →
              </button>
            </div>
          </>
        ) : section === "Perfumes" || section === "Inventario" ? (
          <div className="admin-panel">
            <div className="table-tools">
              <input
                placeholder="Buscar en el catálogo"
                aria-label="Buscar en el catálogo"
              />
              <span>{items.length} productos</span>
            </div>
            <div className="admin-table">
              <div className="table-row table-head">
                <span>Producto</span>
                <span>Estado</span>
                <span>Precio</span>
                <span>Stock</span>
                <span>Acciones</span>
              </div>
              {items.map((p) => (
                <div className="table-row" key={p.id}>
                  <span className="table-product">
                    <img src={p.image} alt="" />
                    <b>
                      {p.name}
                      <small>{p.brand}</small>
                    </b>
                  </span>
                  <span className={`status ${p.status}`}>{p.status}</span>
                  <span>{money(p.variants[0].price)}</span>
                  <span>{p.variants.reduce((a, v) => a + v.stock, 0)}</span>
                  <span className="row-actions">
                    <button onClick={() => edit(p)}>Editar</button>
                    <button onClick={() => toggleStatus(p)}>
                      {p.status === "publicado" ? "Ocultar" : "Publicar"}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-panel admin-empty">
            <h2>{section}</h2>
            <p>
              Este módulo está preparado para conectarse a las tablas y
              políticas incluidas en la migración de Supabase.
            </p>
            <button onClick={() => setSection("Perfumes")}>
              Gestionar catálogo
            </button>
          </div>
        )}
      </section>
      {formOpen && (
        <div className="modal-backdrop">
          <form className="admin-form" onSubmit={handleSubmit(submit)}>
            <button
              type="button"
              className="close-button"
              onClick={() => setFormOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <p className="eyebrow">
              {editing ? "Editar producto" : "Nuevo producto"}
            </p>
            <h2>{editing?.name ?? "Crear fragancia"}</h2>
            <div className="form-grid">
              <Field label="Nombre" error={errors.name?.message}>
                <input {...register("name")} />
              </Field>
              <Field label="Marca" error={errors.brand?.message}>
                <input {...register("brand")} />
              </Field>
              <Field label="Familia">
                <select {...register("family")}>
                  <option>Floral</option>
                  <option>Dulce</option>
                  <option>Amaderado</option>
                  <option>Cítrico</option>
                  <option>Oriental/Ámbar</option>
                  <option>Fresco</option>
                  <option>Gourmand</option>
                  <option>Aromático</option>
                </select>
              </Field>
              <Field label="Género">
                <select {...register("gender")}>
                  <option>Unisex</option>
                  <option>Femenino</option>
                  <option>Masculino</option>
                </select>
              </Field>
              <Field label="Concentración">
                <select {...register("concentration")}>
                  <option>EDT</option>
                  <option>EDP</option>
                  <option>Parfum</option>
                </select>
              </Field>
              <Field label="Estado">
                <select {...register("status")}>
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                </select>
              </Field>
              <Field label="Precio HNL" error={errors.price?.message}>
                <input type="number" {...register("price")} />
              </Field>
              <Field label="Stock" error={errors.stock?.message}>
                <input type="number" {...register("stock")} />
              </Field>
              <Field
                label="Descripción"
                error={errors.description?.message}
                wide
              >
                <textarea rows={4} {...register("description")} />
              </Field>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="button button-light"
                onClick={() => setFormOpen(false)}
              >
                Cancelar
              </button>
              <button className="button button-dark">Guardar cambios</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Field({
  label,
  error,
  wide,
  children,
}: {
  label: string;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "wide" : ""}>
      {label}
      {children}
      {error && <small className="form-error">{error}</small>}
    </label>
  );
}
