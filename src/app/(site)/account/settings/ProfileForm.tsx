"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { updateProfile, ProfileInput } from "@/app/actions/profile";

interface Props {
  email: string;
  initial: ProfileInput;
}

export function ProfileForm({ email, initial }: Props) {
  const [data, setData] = useState<ProfileInput>(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await updateProfile(data);
      setMessage(res.ok ? { kind: "ok", text: res.message } : { kind: "error", text: res.message ?? "Error" });
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
      <Field label="Email" value={email} disabled readOnly />
      <Field
        label="Full name"
        value={data.full_name}
        onChange={(v) => setData({ ...data, full_name: v })}
      />
      <Field
        label="Phone"
        value={data.phone}
        type="tel"
        onChange={(v) => setData({ ...data, phone: v })}
      />
      <div className="flex items-center gap-3 mt-2">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {message && (
          <p className={`font-sans text-[12px] ${message.kind === "ok" ? "text-moss" : "text-oxide"}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="swr-meta text-charcoal">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled}
        readOnly={readOnly}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-4 py-3 font-sans text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors disabled:opacity-60"
      />
    </label>
  );
}
