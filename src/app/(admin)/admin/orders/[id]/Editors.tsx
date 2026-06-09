"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus, updateOrderNote } from "@/app/actions/orders-admin";
import { Button } from "@/components/ui/Button";
import type { Order } from "@/lib/supabase/types";

const STATUSES: Order["status"][] = [
  "pending",
  "paid",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const LABEL: Record<Order["status"], string> = {
  pending: "Pending payment",
  paid: "Payment received",
  in_production: "At the bench",
  shipped: "On its way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrderStatusEditor({
  orderId,
  current,
}: {
  orderId: string;
  current: Order["status"];
}) {
  const [status, setStatus] = useState<Order["status"]>(current);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function change(next: Order["status"]) {
    const prev = status;
    setStatus(next);
    setMessage(null);
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, next);
      if (!res.ok) {
        setStatus(prev);
        setMessage(res.message ?? "Error");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => change(e.target.value as Order["status"])}
        disabled={pending}
        className="rounded-pill bg-charcoal text-cream font-sans text-[12px] tracking-wider uppercase px-4 py-2 border-none outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{LABEL[s]}</option>
        ))}
      </select>
      {message && <span className="swr-meta text-oxide">{message}</span>}
    </div>
  );
}

export function OrderNotesEditor({
  orderId,
  initial,
}: {
  orderId: string;
  initial: string;
}) {
  const [text, setText] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await updateOrderNote(orderId, text);
      setMessage(res.ok ? "Saved." : res.message ?? "Error");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="rounded-lg bg-cream-50 border border-[var(--hairline)] px-3 py-3 font-sans text-[13px] text-charcoal outline-none focus:border-charcoal"
      />
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save notes"}
        </Button>
        {message && <span className="swr-meta text-charcoal/65">{message}</span>}
      </div>
    </div>
  );
}
