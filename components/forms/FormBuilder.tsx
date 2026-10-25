"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import type { Form, FormField, FormStyles, FieldType } from "@/lib/forms";

interface Config {
  name: string;
  webhook_url: string;
  styles: FormStyles;
  fields: FormField[];
}

const FIELD_TYPES: { type: FieldType; label: string }[] = [
  { type: "text", label: "Text" },
  { type: "email", label: "Email" },
  { type: "tel", label: "Phone" },
  { type: "select", label: "Dropdown" },
  { type: "textarea", label: "Multi-line" },
  { type: "checkbox", label: "Checkbox" },
];

const TYPE_LABELS: Record<FieldType, string> = {
  text: "Text",
  email: "Email",
  tel: "Phone",
  select: "Dropdown",
  textarea: "Multi-line",
  checkbox: "Checkbox",
};

function uid() {
  return `field_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function newField(type: FieldType): FormField {
  const defaults: Record<FieldType, Partial<FormField>> = {
    text: { label: "Text Field", placeholder: "" },
    email: { label: "Email Address", placeholder: "you@example.com" },
    tel: { label: "Phone Number", placeholder: "(555) 555-5555" },
    select: { label: "Select Option", options: ["Option 1", "Option 2"] },
    textarea: { label: "Message", placeholder: "Tell us more…" },
    checkbox: { label: "I agree to be contacted" },
  };
  return { id: uid(), type, required: false, ...defaults[type] } as FormField;
}

// ── Field Card ─────────────────────────────────────────────────────────────────

function FieldCard({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMove,
}: {
  field: FormField;
  index: number;
  total: number;
  onChange: (id: string, patch: Partial<FormField>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const INPUT = "w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-[13px] placeholder-[#444] focus:outline-none focus:border-[#444]";

  return (
    <div className="bg-[#0C0C0C] border border-[#242424] rounded-lg p-3.5 space-y-3">
      {/* Header row */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onMove(field.id, -1)}
            disabled={index === 0}
            className="text-[#444] hover:text-[#888] disabled:opacity-30 leading-none text-[10px]"
            aria-label="Move up"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => onMove(field.id, 1)}
            disabled={index === total - 1}
            className="text-[#444] hover:text-[#888] disabled:opacity-30 leading-none text-[10px]"
            aria-label="Move down"
          >
            ▼
          </button>
        </div>

        <span className="text-[10px] text-[#555] bg-[#1a1a1a] rounded px-1.5 py-0.5 font-mono">
          {TYPE_LABELS[field.type]}
        </span>

        <div className="flex items-center gap-1.5 ml-auto">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-[#555] text-[11px]">Required</span>
            <button
              type="button"
              role="switch"
              aria-checked={field.required}
              onClick={() => onChange(field.id, { required: !field.required })}
              className={`relative w-7 h-4 rounded-full transition-colors ${field.required ? "bg-[#FF2D1A]" : "bg-[#2a2a2a]"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${field.required ? "translate-x-3" : ""}`}
              />
            </button>
          </label>

          <button
            type="button"
            onClick={() => onDelete(field.id)}
            className="text-[#444] hover:text-[#FF2D1A] transition-colors ml-1 text-[14px] leading-none"
            aria-label="Delete field"
          >
            ×
          </button>
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-[#555] text-[10px] uppercase tracking-wider mb-1">Label</label>
        <input
          value={field.label}
          onChange={(e) => onChange(field.id, { label: e.target.value })}
          className={INPUT}
          placeholder="Field label"
        />
      </div>

      {/* Placeholder — not for checkbox */}
      {field.type !== "checkbox" && field.type !== "select" && (
        <div>
          <label className="block text-[#555] text-[10px] uppercase tracking-wider mb-1">
            Placeholder
          </label>
          <input
            value={field.placeholder ?? ""}
            onChange={(e) => onChange(field.id, { placeholder: e.target.value })}
            className={INPUT}
            placeholder="Placeholder text (optional)"
          />
        </div>
      )}

      {/* Options — select only */}
      {field.type === "select" && (
        <div>
          <label className="block text-[#555] text-[10px] uppercase tracking-wider mb-1">
            Options (one per line)
          </label>
          <textarea
            value={(field.options ?? []).join("\n")}
            onChange={(e) =>
              onChange(field.id, {
                options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              })
            }
            rows={3}
            className={`${INPUT} resize-none`}
            placeholder={"Option A\nOption B\nOption C"}
          />
        </div>
      )}
    </div>
  );
}

// ── Main Builder ────────────────────────────────────────────────────────────────

export default function FormBuilder({ initialForm }: { initialForm: Form }) {
  const [config, setConfig] = useState<Config>({
    name: initialForm.name,
    webhook_url: initialForm.webhook_url ?? "",
    styles: initialForm.styles,
    fields: initialForm.fields,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const update = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
    setIsDirty(true);
    setSaveState("idle");
  }, []);

  const updateStyle = useCallback(<K extends keyof FormStyles>(key: K, value: FormStyles[K]) => {
    setConfig((c) => ({ ...c, styles: { ...c.styles, [key]: value } }));
    setIsDirty(true);
    setSaveState("idle");
  }, []);

  const addField = useCallback((type: FieldType) => {
    setConfig((c) => ({ ...c, fields: [...c.fields, newField(type)] }));
    setIsDirty(true);
    setSaveState("idle");
    setShowAddMenu(false);
  }, []);

  const updateField = useCallback((id: string, patch: Partial<FormField>) => {
    setConfig((c) => ({
      ...c,
      fields: c.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
    setIsDirty(true);
    setSaveState("idle");
  }, []);

  const deleteField = useCallback((id: string) => {
    setConfig((c) => ({ ...c, fields: c.fields.filter((f) => f.id !== id) }));
    setIsDirty(true);
    setSaveState("idle");
  }, []);

  const moveField = useCallback((id: string, dir: -1 | 1) => {
    setConfig((c) => {
      const fields = [...c.fields];
      const idx = fields.findIndex((f) => f.id === id);
      if (idx < 0) return c;
      const next = idx + dir;
      if (next < 0 || next >= fields.length) return c;
      [fields[idx], fields[next]] = [fields[next], fields[idx]];
      return { ...c, fields };
    });
    setIsDirty(true);
    setSaveState("idle");
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/dashboard/forms/${initialForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: config.name,
        fields: config.fields,
        webhook_url: config.webhook_url || null,
        styles: config.styles,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setIsDirty(false);
      setSaveState("saved");
    } else {
      setSaveState("error");
    }
  }

  function copyEmbed() {
    const origin = window.location.origin;
    const code = `<iframe src="${origin}/form/${initialForm.id}" width="100%" height="520" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const SECTION = "text-[#555] text-[10px] uppercase tracking-wider font-medium mb-2";
  const INPUT_CLS =
    "w-full bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-[13px] placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors";

  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
  const embedUrl = `${origin}/form/${initialForm.id}`;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/forms"
            className="text-[#555] hover:text-[#aaa] text-[13px] transition-colors flex-shrink-0"
          >
            ← Forms
          </Link>
          <span className="text-[#2a2a2a]">/</span>
          <input
            value={config.name}
            onChange={(e) => update("name", e.target.value)}
            className="bg-transparent text-white font-semibold text-[17px] focus:outline-none border-b border-transparent focus:border-[#333] pb-px min-w-0 max-w-[320px]"
          />
        </div>

        <div className="flex items-center gap-3">
          {saveState === "saved" && (
            <span className="text-green-400 text-[12px]">Saved</span>
          )}
          {saveState === "error" && (
            <span className="text-[#FF2D1A] text-[12px]">Save failed</span>
          )}
          <button
            onClick={save}
            disabled={!isDirty || saving}
            className="px-4 py-1.5 bg-[#FF2D1A] hover:bg-[#e02718] disabled:opacity-40 text-white text-[13px] font-semibold rounded-lg transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Config ── */}
        <div className="w-[420px] flex-shrink-0 border-r border-[#1a1a1a] overflow-y-auto p-5 space-y-6">
          {/* Webhook */}
          <div>
            <p className={SECTION}>n8n Webhook URL</p>
            <input
              value={config.webhook_url}
              onChange={(e) => update("webhook_url", e.target.value)}
              className={INPUT_CLS}
              placeholder="https://your-n8n.app.n8n.cloud/webhook/..."
              type="url"
            />
            <p className="text-[#3a3a3a] text-[11px] mt-1.5">
              Paste your n8n &quot;Webhook&quot; trigger URL. Submissions will POST here and
              trigger your voice bot call within 60 seconds.
            </p>
          </div>

          {/* Fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className={`${SECTION} mb-0`}>Fields</p>
              <div className="relative" ref={addMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowAddMenu((v) => !v)}
                  className="text-[#FF2D1A] hover:text-[#ff5040] text-[12px] font-medium transition-colors"
                >
                  + Add field
                </button>
                {showAddMenu && (
                  <div className="absolute right-0 top-6 z-20 bg-[#141414] border border-[#2a2a2a] rounded-lg overflow-hidden shadow-lg min-w-[140px]">
                    {FIELD_TYPES.map(({ type, label }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addField(type)}
                        className="w-full text-left px-3.5 py-2 text-[13px] text-[#ccc] hover:bg-[#242424] hover:text-white transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {config.fields.length === 0 ? (
              <p className="text-[#3a3a3a] text-[12px] text-center py-4 border border-dashed border-[#2a2a2a] rounded-lg">
                No fields yet — click &quot;Add field&quot; to start
              </p>
            ) : (
              <div className="space-y-2">
                {config.fields.map((field, index) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    index={index}
                    total={config.fields.length}
                    onChange={updateField}
                    onDelete={deleteField}
                    onMove={moveField}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Style */}
          <div>
            <p className={SECTION}>Style</p>
            <div className="space-y-3">
              <div>
                <label className="block text-[#555] text-[11px] mb-1.5">Button color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.styles.primaryColor}
                    onChange={(e) => updateStyle("primaryColor", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    value={config.styles.primaryColor}
                    onChange={(e) => updateStyle("primaryColor", e.target.value)}
                    className={`${INPUT_CLS} font-mono`}
                    placeholder="#FF2D1A"
                    maxLength={7}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#555] text-[11px] mb-1.5">Button text</label>
                <input
                  value={config.styles.buttonText}
                  onChange={(e) => updateStyle("buttonText", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="Get a Free Quote"
                />
              </div>

              <div>
                <label className="block text-[#555] text-[11px] mb-1.5">Success message</label>
                <input
                  value={config.styles.successMessage}
                  onChange={(e) => updateStyle("successMessage", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="Thanks! We'll call you within 60 seconds."
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Preview + Embed ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preview */}
          <div>
            <p className={SECTION}>Preview</p>
            <div className="bg-white rounded-xl border border-[#2a2a2a] overflow-hidden shadow-sm">
              <div className="px-6 py-7 max-w-[460px] space-y-4">
                {config.fields.length === 0 ? (
                  <p className="text-gray-300 text-[13px] text-center py-6">
                    Add fields on the left to preview your form
                  </p>
                ) : (
                  config.fields.map((field) => (
                    <div key={field.id}>
                      {field.type !== "checkbox" && (
                        <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                          {field.label || "Untitled"}
                          {field.required && <span className="text-red-400 ml-0.5">*</span>}
                        </div>
                      )}

                      {field.type === "textarea" ? (
                        <div className="w-full border border-gray-100 rounded-lg px-3.5 py-2.5 text-gray-300 text-[13px] min-h-[72px] bg-gray-50" />
                      ) : field.type === "checkbox" ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 border border-gray-300 rounded flex-shrink-0" />
                          <span className="text-gray-400 text-[13px]">{field.label}</span>
                        </div>
                      ) : field.type === "select" ? (
                        <div className="w-full border border-gray-100 rounded-lg px-3.5 py-2.5 text-gray-300 text-[13px] bg-gray-50 flex items-center justify-between">
                          <span>Select an option…</span>
                          <span className="text-gray-300">▾</span>
                        </div>
                      ) : (
                        <div className="w-full border border-gray-100 rounded-lg px-3.5 py-2.5 text-gray-300 text-[13px] bg-gray-50">
                          {field.placeholder || ""}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {config.fields.length > 0 && (
                  <div
                    className="w-full py-3 rounded-lg text-white text-center font-semibold text-[14px]"
                    style={{ backgroundColor: config.styles.primaryColor }}
                  >
                    {config.styles.buttonText || "Submit"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Embed code */}
          <div>
            <p className={SECTION}>Embed code</p>
            <div className="bg-[#0C0C0C] border border-[#242424] rounded-xl p-4">
              <p className="text-[#555] text-[11px] mb-3">
                Paste this into any webpage to embed the form. Adjust the{" "}
                <span className="text-[#888] font-mono">height</span> to match your form length.
              </p>
              <pre className="text-[#aaa] text-[11px] font-mono bg-[#0A0A0A] border border-[#1a1a1a] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {`<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="520"\n  frameborder="0"\n  style="border: none; border-radius: 8px;"\n></iframe>`}
              </pre>
              <button
                onClick={copyEmbed}
                className="mt-3 px-3.5 py-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-[#ccc] text-[12px] font-medium rounded-lg transition-colors"
              >
                {copied ? "Copied!" : "Copy code"}
              </button>
            </div>

            <div className="mt-3 bg-[#141414] border border-[#242424] rounded-xl p-4">
              <p className="text-[#555] text-[11px] mb-1.5 font-medium">Direct link</p>
              <p className="text-[#444] text-[11px] font-mono break-all">{embedUrl}</p>
              <p className="text-[#3a3a3a] text-[11px] mt-1.5">
                Share this URL directly or open it to test your form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
