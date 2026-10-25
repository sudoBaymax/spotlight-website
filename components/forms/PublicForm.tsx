"use client";

import { useState } from "react";
import type { Form } from "@/lib/forms";

export default function PublicForm({ form }: { form: Form }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (id: string, val: string) => setValues((v) => ({ ...v, [id]: val }));
  const primary = form.styles.primaryColor;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch(`/api/form/${form.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong. Please try again.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] px-6 py-14 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white font-bold text-[20px]"
          style={{ backgroundColor: primary }}
        >
          ✓
        </div>
        <p className="text-gray-800 font-semibold text-[16px] max-w-[320px]">
          {form.styles.successMessage}
        </p>
      </div>
    );
  }

  const INPUT_CLS =
    "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 text-[14px] placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors bg-white";

  return (
    <form onSubmit={handleSubmit} className="px-6 py-8 max-w-[520px] mx-auto space-y-4">
      {form.fields.map((field) => (
        <div key={field.id}>
          {field.type !== "checkbox" && (
            <label className="block text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
              {field.label}
              {field.required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
          )}

          {field.type === "textarea" ? (
            <textarea
              value={values[field.id] ?? ""}
              onChange={(e) => set(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
              className={`${INPUT_CLS} resize-none`}
            />
          ) : field.type === "select" ? (
            <select
              value={values[field.id] ?? ""}
              onChange={(e) => set(field.id, e.target.value)}
              required={field.required}
              className={INPUT_CLS}
            >
              <option value="">Select an option…</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={values[field.id] === "true"}
                onChange={(e) => set(field.id, e.target.checked ? "true" : "false")}
                required={field.required}
                className="mt-0.5 w-4 h-4 rounded border-gray-300"
                style={{ accentColor: primary }}
              />
              <span className="text-gray-600 text-[13px] leading-snug">{field.label}</span>
            </label>
          ) : (
            <input
              type={field.type}
              value={values[field.id] ?? ""}
              onChange={(e) => set(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={INPUT_CLS}
            />
          )}
        </div>
      ))}

      {error && (
        <p className="text-red-600 text-[13px] bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg text-white font-semibold text-[14px] transition-opacity disabled:opacity-60 cursor-pointer"
        style={{ backgroundColor: primary }}
      >
        {submitting ? "Sending…" : form.styles.buttonText}
      </button>
    </form>
  );
}
