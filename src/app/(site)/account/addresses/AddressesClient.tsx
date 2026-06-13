"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  AddressInput,
} from "@/app/actions/addresses";
import type { Address } from "@/lib/supabase/types";

interface Props {
  initial: Address[];
}

const EMPTY: AddressInput = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  is_default: false,
};

export function AddressesClient({ initial }: Props) {
  const [editing, setEditing] = useState<AddressInput | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  function onSave(data: AddressInput) {
    setMessage(null);
    startTransition(async () => {
      const res = await saveAddress(data);
      setMessage(res.ok ? { kind: "ok", text: res.message } : { kind: "error", text: res.message ?? "Error" });
      if (res.ok) setEditing(null);
    });
  }

  function onDelete(id: string) {
    if (!confirm("Remove this address?")) return;
    setMessage(null);
    startTransition(async () => {
      const res = await deleteAddress(id);
      setMessage(res.ok ? { kind: "ok", text: res.message } : { kind: "error", text: res.message ?? "Error" });
    });
  }

  function onSetDefault(id: string) {
    setMessage(null);
    startTransition(async () => {
      const res = await setDefaultAddress(id);
      setMessage(res.ok ? { kind: "ok", text: res.message } : { kind: "error", text: res.message ?? "Error" });
    });
  }

  if (editing) {
    return (
      <AddressForm
        initial={editing}
        onCancel={() => setEditing(null)}
        onSave={onSave}
        pending={pending}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {message && (
        <p className={`font-sans text-[12px] ${message.kind === "ok" ? "text-moss" : "text-oxide"}`}>
          {message.text}
        </p>
      )}

      {initial.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--hairline-strong)] bg-cream-50 p-8 text-center flex flex-col gap-3 items-center">
          <p className="font-serif italic text-[18px] text-charcoal/70">
            No addresses yet.
          </p>
          <Button variant="primary" onClick={() => setEditing({ ...EMPTY })}>
            Add an address
          </Button>
        </div>
      ) : (
        <>
          <ul className="m-0 p-0 list-none flex flex-col gap-3">
            {initial.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-6 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-serif font-medium text-[16px] text-charcoal flex items-center gap-2">
                      {a.full_name}
                      {a.is_default && (
                        <span className="swr-meta rounded-pill bg-gold/15 text-charcoal px-2 py-0.5">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[13px] text-charcoal/70 leading-relaxed mt-1">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}
                      <br />
                      {a.city}, {a.state} {a.pincode}
                      <br />
                      {a.country} · {a.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setEditing({
                        id: a.id,
                        full_name: a.full_name,
                        phone: a.phone,
                        line1: a.line1,
                        line2: a.line2 ?? "",
                        city: a.city,
                        state: a.state,
                        pincode: a.pincode,
                        country: a.country,
                        is_default: a.is_default,
                      })
                    }
                    className="swr-meta text-charcoal border-b border-[var(--hairline)] hover:border-charcoal"
                  >
                    Edit
                  </button>
                  {!a.is_default && (
                    <button
                      onClick={() => onSetDefault(a.id)}
                      disabled={pending}
                      className="swr-meta text-charcoal/65 border-b border-[var(--hairline)] hover:border-charcoal hover:text-charcoal"
                    >
                      Make default
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(a.id)}
                    disabled={pending}
                    className="swr-meta text-charcoal/65 border-b border-[var(--hairline)] hover:text-oxide hover:border-oxide ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="secondary" onClick={() => setEditing({ ...EMPTY })} className="self-start">
            + Add another
          </Button>
        </>
      )}
    </div>
  );
}

function AddressForm({
  initial,
  onCancel,
  onSave,
  pending,
}: {
  initial: AddressInput;
  onCancel: () => void;
  onSave: (a: AddressInput) => void;
  pending: boolean;
}) {
  const [a, setA] = useState<AddressInput>(initial);
  function set<K extends keyof AddressInput>(k: K, v: AddressInput[K]) {
    setA((p) => ({ ...p, [k]: v }));
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(a);
      }}
      className="flex flex-col gap-4 rounded-xl border border-[var(--hairline)] bg-cream-50 p-5 md:p-7"
    >
      <Field label="Full name" value={a.full_name} onChange={(v) => set("full_name", v)} required />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Phone" value={a.phone} onChange={(v) => set("phone", v)} required type="tel" />
        <Field label="Pincode" value={a.pincode} onChange={(v) => set("pincode", v)} required inputMode="numeric" />
      </div>
      <Field label="Address line 1" value={a.line1} onChange={(v) => set("line1", v)} required />
      <Field label="Address line 2" value={a.line2 ?? ""} onChange={(v) => set("line2", v)} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="City" value={a.city} onChange={(v) => set("city", v)} required />
        <Field label="State" value={a.state} onChange={(v) => set("state", v)} required />
      </div>
      <label className="flex items-center gap-2 swr-meta text-charcoal cursor-pointer select-none">
        <input
          type="checkbox"
          checked={a.is_default ?? false}
          onChange={(e) => set("is_default", e.target.checked)}
          className="h-4 w-4 accent-charcoal"
        />
        Make this my default address
      </label>
      <div className="flex gap-3 mt-2">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save address"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  inputMode?: "numeric" | "text" | "email" | "tel";
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="swr-meta text-charcoal">{label}{required && " *"}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        className="bg-transparent border-b border-[var(--hairline-strong)] px-0 py-3 font-sans text-[15px] text-charcoal outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}
