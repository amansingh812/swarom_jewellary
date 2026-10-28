"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { saveProduct, deleteProduct, ProductInput } from "@/app/actions/products-admin";
import {
  uploadProductImage,
  deleteProductImage,
  deleteProductImages,
} from "@/app/actions/storage";
import type { Product } from "@/lib/supabase/types";
import { slugify } from "@/lib/slug";

interface Props {
  product?: Product;
  collections: { id: string; name: string }[];
}

const CATEGORIES: ProductInput["category"][] = [
  "pendant",
  "ring",
  "bracelet",
  "anklet",
  "for-two",
];

function keyify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)+/g, "");
}

/* ── Options: the jsonb shape the storefront reads ──────────────
   { engraving: { type:"text",   label, max },
     chain:     { type:"select", label, choices[], default } }        */

type OptKind = "text" | "select";

interface OptRow {
  uid: string;
  key: string;
  kind: OptKind;
  label: string;
  max: number;
  choices: string[];
  def: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function parseOptions(raw: unknown): OptRow[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
  const out: OptRow[] = [];
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!val || typeof val !== "object" || Array.isArray(val)) continue;
    const v = val as Record<string, unknown>;
    out.push({
      uid: uid(),
      key,
      kind: v.type === "select" ? "select" : "text",
      label: typeof v.label === "string" ? v.label : key,
      max: typeof v.max === "number" ? v.max : 12,
      choices: Array.isArray(v.choices) ? v.choices.map((c) => String(c)) : [],
      def: typeof v.default === "string" ? v.default : "",
    });
  }
  return out;
}

function serializeOptions(rows: OptRow[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const r of rows) {
    const key = r.key || keyify(r.label);
    if (!key) continue;
    out[key] =
      r.kind === "text"
        ? { type: "text", label: r.label, max: r.max }
        : {
            type: "select",
            label: r.label,
            choices: r.choices,
            default: r.def || r.choices[0] || "",
          };
  }
  return out;
}

export function ProductEditor({ product, collections }: Props) {
  const router = useRouter();

  const [data, setData] = useState<ProductInput>({
    id: product?.id,
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    modifier: product?.modifier ?? "",
    description: product?.description ?? "",
    collection_id: product?.collection_id ?? null,
    category: (product?.category as ProductInput["category"]) ?? "pendant",
    price: product?.price ?? 0,
    compare_at_price: product?.compare_at_price ?? null,
    status: (product?.status as ProductInput["status"]) ?? "draft",
    meta: product?.meta ?? "",
    image_main: product?.image_main ?? "",
    images: product?.images?.length
      ? product.images
      : product?.image_main
        ? [product.image_main]
        : [],
    options: (product?.options as Record<string, unknown>) ?? {},
    inventory: product?.inventory ?? null,
  });

  const [opts, setOpts] = useState<OptRow[]>(() => parseOptions(product?.options));
  const [showJson, setShowJson] = useState(false);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const images = data.images ?? [];

  function set<K extends keyof ProductInput>(k: K, v: ProductInput[K]) {
    setData((p) => ({ ...p, [k]: v }));
  }

  /* ── save ─────────────────────────────────────────────── */

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    // The first photograph is always the main one.
    const payload: ProductInput = {
      ...data,
      image_main: images[0] ?? "",
      options: serializeOptions(opts),
    };

    startTransition(async () => {
      const res = await saveProduct(payload);
      if (res.ok) {
        setMessage({ kind: "ok", text: "Saved." });
        if (!product && res.id) router.push(`/admin/products/${res.id}`);
        else router.refresh();
      } else {
        setMessage({ kind: "error", text: res.message ?? "Could not save." });
      }
    });
  }

  /* ── images ───────────────────────────────────────────── */

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setMessage(null);

    const added: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploading(`Uploading ${i + 1} of ${files.length}…`);
      const fd = new FormData();
      fd.append("file", files[i]);
      const res = await uploadProductImage(fd);
      if (res.ok && res.url) {
        added.push(res.url);
      } else {
        setMessage({ kind: "error", text: res.message ?? "Upload failed." });
        break;
      }
    }

    setUploading(null);
    if (fileRef.current) fileRef.current.value = "";
    if (added.length) {
      setData((p) => ({ ...p, images: [...(p.images ?? []), ...added] }));
      setMessage({
        kind: "ok",
        text: `Added ${added.length} ${added.length === 1 ? "photograph" : "photographs"}. Save to keep them.`,
      });
    }
  }

  function moveImage(index: number, by: -1 | 1) {
    const next = [...images];
    const target = index + by;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    set("images", next);
  }

  function removeImage(url: string) {
    set(
      "images",
      images.filter((x) => x !== url)
    );
    // Drop the object from the bucket too, so removing a photo doesn't
    // leave it orphaned in storage. Local seed paths are skipped server-side.
    startTransition(async () => {
      const res = await deleteProductImage(url);
      if (!res.ok) {
        setMessage({
          kind: "error",
          text: `Removed from the piece, but storage said: ${res.message}`,
        });
      }
    });
  }

  /* ── options ──────────────────────────────────────────── */

  function addOption(kind: OptKind) {
    setOpts((rows) => [
      ...rows,
      kind === "text"
        ? { uid: uid(), key: "", kind, label: "Engraving", max: 12, choices: [], def: "" }
        : {
            uid: uid(),
            key: "",
            kind,
            label: "Chain length",
            max: 12,
            choices: ["16″", "18″"],
            def: "16″",
          },
    ]);
  }

  function patchOption(uidToPatch: string, patch: Partial<OptRow>) {
    setOpts((rows) =>
      rows.map((r) => (r.uid === uidToPatch ? { ...r, ...patch } : r))
    );
  }

  function removeOption(uidToDrop: string) {
    setOpts((rows) => rows.filter((r) => r.uid !== uidToDrop));
  }

  /* ── delete ───────────────────────────────────────────── */

  function onDelete() {
    if (!product?.id) return;
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    startTransition(async () => {
      if (images.length) await deleteProductImages(images);
      const res = await deleteProduct(product.id);
      if (!res?.ok) setMessage({ kind: "error", text: res?.message ?? "Error" });
    });
  }

  const busy = pending || uploading !== null;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>{product ? "Edit piece" : "New piece"}</Eyebrow>
          <h1 className="swr-h1 mt-2">{data.name || "New product"}</h1>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`font-sans text-[12px] ${
                message.kind === "ok" ? "text-moss" : "text-oxide"
              }`}
            >
              {message.text}
            </span>
          )}
          {product?.id && (
            <Button
              type="button"
              variant="secondary"
              onClick={onDelete}
              disabled={busy}
              className="text-oxide hover:border-oxide"
            >
              Delete
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={busy}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[7fr_5fr] md:gap-10">
        {/* ── left ── */}
        <div className="flex flex-col gap-4">
          <Card title="Basics">
            <Field
              label="Name"
              value={data.name}
              required
              onChange={(v) => {
                set("name", v);
                if (!data.slug || data.slug === slugify(data.name)) set("slug", slugify(v));
              }}
            />
            <Field
              label="Modifier (italic)"
              value={data.modifier ?? ""}
              onChange={(v) => set("modifier", v)}
              placeholder="in your hand"
            />
            <Field
              label="Slug (URL)"
              value={data.slug}
              required
              onChange={(v) => set("slug", slugify(v))}
            />
            <Textarea
              label="Description"
              value={data.description ?? ""}
              onChange={(v) => set("description", v)}
              rows={4}
            />
            <Field
              label="Meta (under price)"
              value={data.meta ?? ""}
              onChange={(v) => set("meta", v)}
              placeholder="925 silver · engraved"
            />
          </Card>

          <Card title="Photographs">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-sans text-[11px] text-charcoal/55">
                JPG, PNG, WEBP or SVG under 8 MB. The first one is the main image.
              </p>
              <span className="swr-meta text-charcoal/50">
                {images.length} {images.length === 1 ? "photo" : "photos"}
              </span>
            </div>

            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={onUpload}
              className="font-sans text-[13px] text-charcoal/70"
            />
            {uploading && <p className="swr-meta text-charcoal/55">{uploading}</p>}

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {images.map((url, i) => (
                  <figure
                    key={url}
                    className="relative m-0 rounded-md overflow-hidden bg-cream-200 aspect-[4/5] border border-[var(--hairline)]"
                  >
                    <Image src={url} alt="" fill className="object-cover" sizes="200px" />

                    {i === 0 && (
                      <span className="absolute top-2 left-2 rounded-pill bg-charcoal px-2 py-0.5 font-sans text-[9px] tracking-wider uppercase text-cream">
                        Main
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      aria-label={`Remove photograph ${i + 1}`}
                      className="absolute top-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-pill bg-cream/90 text-charcoal hover:bg-cream"
                    >
                      <Icon name="close" size={12} />
                    </button>

                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        disabled={i === 0}
                        aria-label={`Move photograph ${i + 1} earlier`}
                        className="grid h-7 w-7 place-items-center rounded-pill bg-cream/90 text-charcoal hover:bg-cream disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Icon name="chevron-right" size={12} className="rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === images.length - 1}
                        aria-label={`Move photograph ${i + 1} later`}
                        className="grid h-7 w-7 place-items-center rounded-pill bg-cream/90 text-charcoal hover:bg-cream disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Icon name="chevron-right" size={12} />
                      </button>
                    </div>
                  </figure>
                ))}
              </div>
            )}
          </Card>

          <Card title="What the customer chooses">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-sans text-[11px] text-charcoal/55">
                Builds the <code>options</code> column. No hand-written JSON needed.
              </p>
              <button
                type="button"
                onClick={() => setShowJson((v) => !v)}
                className="swr-meta text-charcoal/60 border-b border-[var(--hairline)] hover:border-charcoal hover:text-charcoal"
              >
                {showJson ? "Hide JSON" : "View JSON"}
              </button>
            </div>

            {opts.length === 0 && (
              <p className="font-serif italic text-[15px] text-charcoal/55 py-2">
                No options yet — this piece ships exactly as photographed.
              </p>
            )}

            {opts.map((o) => (
              <div
                key={o.uid}
                className="rounded-lg border border-[var(--hairline)] bg-cream p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="swr-meta text-charcoal">
                    {o.kind === "text" ? "Engraved text" : "Choice list"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOption(o.uid)}
                    className="swr-meta text-oxide"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="Label"
                    value={o.label}
                    onChange={(v) => patchOption(o.uid, { label: v, key: o.key || keyify(v) })}
                  />
                  {o.kind === "text" ? (
                    <Field
                      label="Max characters"
                      type="number"
                      value={String(o.max)}
                      onChange={(v) => patchOption(o.uid, { max: Number(v) || 1 })}
                    />
                  ) : (
                    <Field
                      label="Default choice"
                      value={o.def}
                      onChange={(v) => patchOption(o.uid, { def: v })}
                    />
                  )}
                </div>

                {o.kind === "select" && (
                  <Field
                    label="Choices (comma separated)"
                    value={o.choices.join(", ")}
                    onChange={(v) =>
                      patchOption(o.uid, {
                        choices: v
                          .split(",")
                          .map((c) => c.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 flex-wrap">
              <Button type="button" variant="secondary" size="sm" onClick={() => addOption("text")}>
                + Engraved text
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => addOption("select")}>
                + Choice list
              </Button>
            </div>

            {showJson && (
              <pre className="rounded-lg bg-charcoal text-cream/90 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
                {JSON.stringify(serializeOptions(opts), null, 2)}
              </pre>
            )}
          </Card>
        </div>

        {/* ── right ── */}
        <aside className="flex flex-col gap-4">
          <Card title="Pricing">
            <Field
              label="Price (₹)"
              value={String(data.price)}
              type="number"
              required
              onChange={(v) => set("price", Number(v) || 0)}
            />
            <Field
              label="Compare-at price (optional, ₹)"
              value={data.compare_at_price != null ? String(data.compare_at_price) : ""}
              type="number"
              onChange={(v) => set("compare_at_price", v ? Number(v) : null)}
            />
          </Card>

          <Card title="Organisation">
            <Select
              label="Status"
              value={data.status}
              onChange={(v) => set("status", v as ProductInput["status"])}
              options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "archived", label: "Archived" },
              ]}
            />
            <Select
              label="Category"
              value={data.category}
              onChange={(v) => set("category", v as ProductInput["category"])}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <Select
              label="Collection"
              value={data.collection_id ?? ""}
              onChange={(v) => set("collection_id", v || null)}
              options={[
                { value: "", label: "— none —" },
                ...collections.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <Field
              label="Inventory (blank = made to order)"
              value={data.inventory != null ? String(data.inventory) : ""}
              type="number"
              onChange={(v) => set("inventory", v ? Number(v) : null)}
            />
          </Card>

          <Card title="How it looks on the shop">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-cream-200 border border-[var(--hairline)]">
              {images[0] ? (
                <Image src={images[0]} alt="" fill className="object-cover" sizes="320px" />
              ) : (
                <span className="grid h-full w-full place-items-center swr-meta text-charcoal/40">
                  No photograph yet
                </span>
              )}
            </div>
            <p className="font-serif text-[16px] text-charcoal mt-1">
              {data.name || "Product name"}{" "}
              {data.modifier && <i className="text-charcoal/65">{data.modifier}</i>}
            </p>
            {data.meta && <p className="swr-meta text-charcoal/55">{data.meta}</p>}
            <p className="swr-price">₹ {(data.price || 0).toLocaleString("en-IN")}</p>
          </Card>
        </aside>
      </div>
    </form>
  );
}

/* ── small form primitives ───────────────────────────────── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-6 flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="swr-meta text-charcoal">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="swr-meta text-charcoal">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="swr-meta text-charcoal">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
