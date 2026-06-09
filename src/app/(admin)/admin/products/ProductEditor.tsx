"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { saveProduct, deleteProduct, ProductInput } from "@/app/actions/products-admin";
import { uploadProductImage } from "@/app/actions/storage";
import type { Product } from "@/lib/supabase/types";

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

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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
    images: product?.images ?? [],
    options: (product?.options as Record<string, unknown>) ?? {},
    inventory: product?.inventory ?? null,
  });
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [optionsJson, setOptionsJson] = useState(JSON.stringify(data.options ?? {}, null, 2));
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof ProductInput>(k: K, v: ProductInput[K]) {
    setData((p) => ({ ...p, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    let parsedOpts: Record<string, unknown> = {};
    try {
      parsedOpts = optionsJson.trim() ? JSON.parse(optionsJson) : {};
    } catch {
      setMessage({ kind: "error", text: "Options must be valid JSON." });
      return;
    }
    const payload: ProductInput = { ...data, options: parsedOpts };

    startTransition(async () => {
      const res = await saveProduct(payload);
      if (res.ok) {
        setMessage({ kind: "ok", text: "Saved." });
        if (!product && res.id) router.push(`/admin/products/${res.id}`);
      } else {
        setMessage({ kind: "error", text: res.message ?? "Error" });
      }
    });
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadProductImage(fd);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (res.ok && res.url) {
      setData((p) => ({
        ...p,
        image_main: p.image_main || res.url,
        images: [...(p.images ?? []), res.url!],
      }));
      setMessage({ kind: "ok", text: "Uploaded." });
    } else {
      setMessage({ kind: "error", text: res.message ?? "Upload failed." });
    }
  }

  function removeImage(url: string) {
    setData((p) => ({
      ...p,
      images: (p.images ?? []).filter((x) => x !== url),
      image_main: p.image_main === url ? "" : p.image_main,
    }));
  }

  function onDelete() {
    if (!product?.id) return;
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deleteProduct(product.id);
      if (!res?.ok) setMessage({ kind: "error", text: res?.message ?? "Error" });
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <Eyebrow>{product ? "Edit piece" : "New piece"}</Eyebrow>
          <h1 className="swr-h1 mt-2">{product?.name || "New product"}</h1>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`font-sans text-[12px] ${message.kind === "ok" ? "text-moss" : "text-oxide"}`}>
              {message.text}
            </span>
          )}
          {product?.id && (
            <Button type="button" variant="secondary" onClick={onDelete} disabled={pending} className="text-oxide hover:border-oxide">
              Delete
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={pending || uploading}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[7fr_5fr] md:gap-10">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <Card title="Basics">
            <Field label="Name" value={data.name} onChange={(v) => {
              set("name", v);
              if (!data.slug || data.slug === slugify(data.name)) set("slug", slugify(v));
            }} required />
            <Field label="Modifier (italic)" value={data.modifier ?? ""} onChange={(v) => set("modifier", v)} placeholder="in your hand" />
            <Field label="Slug (URL)" value={data.slug} onChange={(v) => set("slug", slugify(v))} required />
            <Textarea label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={4} />
            <Field label="Meta (under price)" value={data.meta ?? ""} onChange={(v) => set("meta", v)} placeholder="925 silver · engraved" />
          </Card>

          <Card title="Images">
            <input
              ref={fileRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={onUpload}
              className="font-sans text-[13px] text-charcoal/70"
            />
            <p className="font-sans text-[11px] text-charcoal/50">
              Upload JPG/PNG/WEBP/SVG, &lt; 8 MB. First image is the main one.
            </p>
            {uploading && <p className="swr-meta text-charcoal/55">Uploading…</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {(data.images ?? []).map((url) => (
                <div key={url} className="relative rounded-md overflow-hidden bg-cream-200 aspect-[4/5] group">
                  <Image src={url} alt="" fill className="object-cover" sizes="200px" />
                  <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {data.image_main !== url && (
                      <button type="button" onClick={() => set("image_main", url)} className="rounded-pill bg-cream px-2 py-1 font-sans text-[10px] tracking-wider uppercase text-charcoal">
                        Set main
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(url)} className="rounded-pill bg-oxide px-2 py-1 font-sans text-[10px] tracking-wider uppercase text-cream">
                      Remove
                    </button>
                  </div>
                  {data.image_main === url && (
                    <span className="absolute top-2 left-2 rounded-pill bg-gold/90 text-cream px-2 py-0.5 font-sans text-[9px] tracking-wider uppercase">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Options (JSON)">
            <textarea
              value={optionsJson}
              onChange={(e) => setOptionsJson(e.target.value)}
              rows={10}
              spellCheck={false}
              className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-3 py-3 font-mono text-[12px] text-charcoal outline-none focus:border-charcoal"
            />
            <p className="font-sans text-[11px] text-charcoal/50">
              See <code>lib/products.ts</code> for the shape. Engraving text fields, chain length dropdowns, etc.
            </p>
          </Card>
        </div>

        {/* Right column */}
        <aside className="flex flex-col gap-4">
          <Card title="Pricing">
            <Field label="Price (₹)" value={String(data.price)} type="number" onChange={(v) => set("price", Number(v) || 0)} required />
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
              label="Inventory (leave blank for made-to-order)"
              value={data.inventory != null ? String(data.inventory) : ""}
              type="number"
              onChange={(v) => set("inventory", v ? Number(v) : null)}
            />
          </Card>
        </aside>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-6 flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="swr-meta text-charcoal">{label}{required && " *"}</span>
      <input
        type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
      />
    </label>
  );
}

function Textarea({
  label, value, onChange, rows,
}: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="swr-meta text-charcoal">{label}</span>
      <textarea
        value={value} rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
      />
    </label>
  );
}

function Select({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
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
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
