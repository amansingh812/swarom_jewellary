"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  saveCollection,
  deleteCollection,
  reorderCollections,
  slugify,
} from "@/app/actions/collections-admin";

export interface CollectionRowView {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
  productCount: number;
}

interface Draft {
  id?: string;
  name: string;
  slug: string;
  description: string;
}

const EMPTY: Draft = { name: "", slug: "", description: "" };

export function CollectionsClient({ initial }: { initial: CollectionRowView[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  function openNew() {
    setMsg(null);
    setDraft({ ...EMPTY });
  }

  function openEdit(c: CollectionRowView) {
    setMsg(null);
    setDraft({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
    });
  }

  function patch<K extends keyof Draft>(k: K, v: Draft[K]) {
    setDraft((d) => (d ? { ...d, [k]: v } : d));
  }

  function save() {
    if (!draft) return;
    setMsg(null);
    startTransition(async () => {
      const res = await saveCollection({
        id: draft.id,
        name: draft.name,
        slug: draft.slug,
        description: draft.description,
        position: draft.id
          ? rows.find((r) => r.id === draft.id)?.position ?? rows.length + 1
          : rows.length + 1,
      });
      if (!res.ok) {
        setMsg({ kind: "error", text: res.message ?? "Could not save." });
        return;
      }
      setDraft(null);
      setMsg({ kind: "ok", text: "Saved." });
      router.refresh();
    });
  }

  function remove(c: CollectionRowView) {
    const warning = c.productCount
      ? `Delete "${c.name}"? ${c.productCount} ${
          c.productCount === 1 ? "piece" : "pieces"
        } will become uncategorised.`
      : `Delete "${c.name}"?`;
    if (!confirm(warning)) return;
    setMsg(null);
    startTransition(async () => {
      const res = await deleteCollection(c.id);
      if (!res.ok) {
        setMsg({ kind: "error", text: res.message ?? "Could not delete." });
        return;
      }
      setMsg({ kind: "ok", text: res.message ?? "Deleted." });
      router.refresh();
    });
  }

  function move(index: number, by: -1 | 1) {
    const next = [...rows];
    const target = index + by;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    startTransition(async () => {
      const res = await reorderCollections(next.map((r) => r.id));
      if (!res.ok) {
        setMsg({ kind: "error", text: res.message ?? "Could not reorder." });
        setRows(rows);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="swr-meta text-charcoal/55">
            {rows.length} {rows.length === 1 ? "collection" : "collections"}
          </span>
          {msg && (
            <span
              className={`font-sans text-[12px] ${
                msg.kind === "ok" ? "text-moss" : "text-oxide"
              }`}
            >
              {msg.text}
            </span>
          )}
        </div>
        <Button type="button" variant="primary" onClick={openNew} disabled={pending || !!draft}>
          + New collection
        </Button>
      </div>

      {draft && (
        <div className="rounded-xl border border-[var(--hairline-strong)] bg-cream-50 p-5 md:p-6 flex flex-col gap-4">
          <p className="swr-meta text-charcoal">
            {draft.id ? "Edit collection" : "New collection"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Name"
              value={draft.name}
              onChange={(v) => {
                patch("name", v);
                if (!draft.id && (!draft.slug || draft.slug === slugify(draft.name))) {
                  patch("slug", slugify(v));
                }
              }}
            />
            <Field
              label="Slug"
              value={draft.slug}
              onChange={(v) => patch("slug", slugify(v))}
            />
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="swr-meta text-charcoal">Description</span>
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) => patch("description", e.target.value)}
              className="rounded-lg bg-cream border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
            />
          </label>
          <div className="flex items-center gap-3">
            <Button type="button" variant="primary" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDraft(null)}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {rows.length === 0 && !draft ? (
        <div className="rounded-xl border border-dashed border-[var(--hairline-strong)] bg-cream-50 p-10 text-center">
          <p className="font-serif italic text-[20px] text-charcoal/70">
            No collections yet.
          </p>
        </div>
      ) : (
        <ul className="m-0 list-none p-0 rounded-xl border border-[var(--hairline)] bg-cream-50 divide-y divide-[var(--hairline)]">
          {rows.map((c, i) => (
            <li key={c.id} className="flex items-center gap-4 p-4 md:p-5">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || pending}
                  aria-label={`Move ${c.name} up`}
                  className="text-charcoal/45 hover:text-charcoal disabled:opacity-25 disabled:pointer-events-none"
                >
                  <Icon name="chevron-down" size={14} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1 || pending}
                  aria-label={`Move ${c.name} down`}
                  className="text-charcoal/45 hover:text-charcoal disabled:opacity-25 disabled:pointer-events-none"
                >
                  <Icon name="chevron-down" size={14} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-serif text-[16px] text-charcoal m-0">{c.name}</p>
                <p className="swr-meta text-charcoal/50 mt-1">
                  /{c.slug} · {c.productCount}{" "}
                  {c.productCount === 1 ? "piece" : "pieces"}
                </p>
                {c.description && (
                  <p className="font-sans text-[12.5px] leading-relaxed text-charcoal/65 mt-2 max-w-[520px]">
                    {c.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  disabled={pending}
                  className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(c)}
                  disabled={pending}
                  className="swr-meta text-oxide border-b border-transparent hover:border-oxide"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="swr-meta text-charcoal">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-cream border border-[var(--hairline)] px-3 py-2.5 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
      />
    </label>
  );
}
