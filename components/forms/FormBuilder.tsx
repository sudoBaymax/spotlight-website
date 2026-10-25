"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

const TYPE_COLORS: Record<FieldType, string> = {
  text: "text-blue-400 bg-blue-400/10",
  email: "text-purple-400 bg-purple-400/10",
  tel: "text-green-400 bg-green-400/10",
  select: "text-amber-400 bg-amber-400/10",
  textarea: "text-cyan-400 bg-cyan-400/10",
  checkbox: "text-pink-400 bg-pink-400/10",
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

// ── Icons ──────────────────────────────────────────────────────────────────────

function DragIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <circle cx="4.5" cy="2.5" r="1.3" />
      <circle cx="9.5" cy="2.5" r="1.3" />
      <circle cx="4.5" cy="7" r="1.3" />
      <circle cx="9.5" cy="7" r="1.3" />
      <circle cx="4.5" cy="11.5" r="1.3" />
      <circle cx="9.5" cy="11.5" r="1.3" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 5l5 5 5-5" />
    </svg>
  );
}

// ── Field Card (inner content, shared between sortable + overlay) ─────────────

function FieldCardContent({
  field,
  expanded,
  onToggle,
  onDelete,
  onChange,
  dragHandleProps,
  isDragging = false,
}: {
  field: FormField;
  expanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onChange: (id: string, patch: Partial<FormField>) => void;
  dragHandleProps?: Record<string, any>;
  isDragging?: boolean;
}) {
  const INPUT =
    "w-full bg-[#0C0C0C] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-[14px] placeholder-[#555] focus:outline-none focus:border-[#555] transition-colors";

  return (
    <div
      className={`bg-[#1c1c1c] border rounded-xl overflow-hidden transition-all ${
        isDragging
          ? "border-[#FF2D1A]/40 shadow-lg shadow-black/40"
          : expanded
          ? "border-[#3a3a3a]"
          : "border-[#2a2a2a] hover:border-[#3a3a3a]"
      }`}
    >
      {/* ── Header (always visible) ── */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        {/* Drag handle */}
        <button
          {...dragHandleProps}
          className="text-[#444] hover:text-[#888] cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors p-0.5 rounded"
          aria-label="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <DragIcon />
        </button>

        {/* Type badge */}
        <span
          className={`text-[11px] font-semibold rounded px-2 py-0.5 flex-shrink-0 ${TYPE_COLORS[field.type]}`}
        >
          {TYPE_LABELS[field.type]}
        </span>

        {/* Label preview — click to expand */}
        <button
          onClick={onToggle}
          className="flex-1 text-left text-white text-[14px] font-medium truncate min-w-0"
        >
          {field.label || <span className="text-[#555] italic">Untitled field</span>}
        </button>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Required indicator */}
          {field.required && (
            <span className="text-[#FF2D1A] text-[11px] font-semibold">required</span>
          )}

          {/* Expand/collapse toggle */}
          <button
            onClick={onToggle}
            className="text-[#555] hover:text-[#999] transition-colors p-1"
            aria-label={expanded ? "Collapse field" : "Expand field"}
          >
            <ChevronIcon open={expanded} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(field.id)}
            className="text-[#444] hover:text-[#FF2D1A] transition-colors p-1 text-[18px] leading-none"
            aria-label="Delete field"
          >
            ×
          </button>
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && (
        <div className="border-t border-[#2a2a2a] px-3.5 pb-3.5 pt-3 space-y-3">
          {/* Label */}
          <div>
            <label className="block text-[#999] text-[11px] uppercase tracking-wider mb-1.5">
              Label
            </label>
            <input
              value={field.label}
              onChange={(e) => onChange(field.id, { label: e.target.value })}
              className={INPUT}
              placeholder="Field label"
            />
          </div>

          {/* Placeholder */}
          {field.type !== "checkbox" && field.type !== "select" && (
            <div>
              <label className="block text-[#999] text-[11px] uppercase tracking-wider mb-1.5">
                Placeholder text
              </label>
              <input
                value={field.placeholder ?? ""}
                onChange={(e) => onChange(field.id, { placeholder: e.target.value })}
                className={INPUT}
                placeholder="Optional hint text inside the field"
              />
            </div>
          )}

          {/* Options for select */}
          {field.type === "select" && (
            <div>
              <label className="block text-[#999] text-[11px] uppercase tracking-wider mb-1.5">
                Options{" "}
                <span className="normal-case text-[#555] font-normal">(one per line)</span>
              </label>
              <textarea
                value={(field.options ?? []).join("\n")}
                onChange={(e) =>
                  onChange(field.id, {
                    options: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                rows={4}
                className={`${INPUT} resize-none`}
                placeholder={"Option A\nOption B\nOption C"}
              />
            </div>
          )}

          {/* Required toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#999] text-[13px]">Required field</span>
            <button
              type="button"
              role="switch"
              aria-checked={field.required}
              onClick={() => onChange(field.id, { required: !field.required })}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                field.required ? "bg-[#FF2D1A]" : "bg-[#2a2a2a]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  field.required ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sortable wrapper ──────────────────────────────────────────────────────────

function SortableFieldCard({
  field,
  expanded,
  onToggle,
  onDelete,
  onChange,
}: {
  field: FormField;
  expanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onChange: (id: string, patch: Partial<FormField>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FieldCardContent
        field={field}
        expanded={expanded}
        onToggle={onToggle}
        onDelete={onDelete}
        onChange={onChange}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

// ── Main Builder ──────────────────────────────────────────────────────────────

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
  const [expandedFields, setExpandedFields] = useState<Set<string>>(
    new Set(initialForm.fields.map((f) => f.id))
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const dirty = useCallback(() => { setIsDirty(true); setSaveState("idle"); }, []);

  const update = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
    dirty();
  }, [dirty]);

  const updateStyle = useCallback(<K extends keyof FormStyles>(key: K, value: FormStyles[K]) => {
    setConfig((c) => ({ ...c, styles: { ...c.styles, [key]: value } }));
    dirty();
  }, [dirty]);

  const addField = useCallback((type: FieldType) => {
    const field = newField(type);
    setConfig((c) => ({ ...c, fields: [...c.fields, field] }));
    setExpandedFields((s) => new Set([...s, field.id]));
    setShowAddMenu(false);
    dirty();
  }, [dirty]);

  const updateField = useCallback((id: string, patch: Partial<FormField>) => {
    setConfig((c) => ({
      ...c,
      fields: c.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
    dirty();
  }, [dirty]);

  const deleteField = useCallback((id: string) => {
    setConfig((c) => ({ ...c, fields: c.fields.filter((f) => f.id !== id) }));
    setExpandedFields((s) => { const n = new Set(s); n.delete(id); return n; });
    dirty();
  }, [dirty]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedFields((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setConfig((c) => {
      const oldIdx = c.fields.findIndex((f) => f.id === active.id);
      const newIdx = c.fields.findIndex((f) => f.id === over.id);
      return { ...c, fields: arrayMove(c.fields, oldIdx, newIdx) };
    });
    dirty();
  }

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
    if (res.ok) { setIsDirty(false); setSaveState("saved"); }
    else setSaveState("error");
  }

  function copyEmbed() {
    const origin = window.location.origin;
    const code = `<iframe src="${origin}/form/${initialForm.id}" width="100%" height="520" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const allExpanded = config.fields.length > 0 && config.fields.every((f) => expandedFields.has(f.id));

  function toggleAll() {
    if (allExpanded) setExpandedFields(new Set());
    else setExpandedFields(new Set(config.fields.map((f) => f.id)));
  }

  const SECTION = "text-[#999] text-[12px] uppercase tracking-wider font-medium mb-2";
  const INPUT_CLS =
    "w-full bg-[#0C0C0C] border border-[#3a3a3a] rounded-lg px-3.5 py-2.5 text-white text-[15px] placeholder-[#555] focus:outline-none focus:border-[#555] transition-colors";

  const activeField = config.fields.find((f) => f.id === activeId);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
  const embedUrl = `${origin}/form/${initialForm.id}`;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/forms"
            className="text-[#999] hover:text-[#ccc] text-[14px] transition-colors flex-shrink-0"
          >
            ← Forms
          </Link>
          <span className="text-[#333]">/</span>
          <input
            value={config.name}
            onChange={(e) => update("name", e.target.value)}
            className="bg-transparent text-white font-semibold text-[18px] focus:outline-none border-b border-transparent focus:border-[#444] pb-px min-w-0 max-w-[320px] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          {saveState === "saved" && <span className="text-green-400 text-[13px]">Saved</span>}
          {saveState === "error" && <span className="text-[#FF2D1A] text-[13px]">Save failed</span>}
          <button
            onClick={save}
            disabled={!isDirty || saving}
            className="px-4 py-1.5 bg-[#FF2D1A] hover:bg-[#e02718] disabled:opacity-40 text-white text-[14px] font-semibold rounded-lg transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Config ── */}
        <div className="w-[460px] flex-shrink-0 border-r border-[#2a2a2a] overflow-y-auto">

          {/* Webhook section */}
          <div className="px-5 pt-5 pb-4 border-b border-[#2a2a2a]">
            <p className={SECTION}>n8n Webhook URL</p>
            <input
              value={config.webhook_url}
              onChange={(e) => update("webhook_url", e.target.value)}
              className={INPUT_CLS}
              placeholder="https://your-n8n.app.n8n.cloud/webhook/..."
              type="url"
            />
            <p className="text-[#555] text-[12px] mt-1.5 leading-relaxed">
              Submissions POST here and trigger your voice bot call within 60 seconds.
            </p>
          </div>

          {/* Fields section */}
          <div className="px-5 pt-4 pb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <p className={`${SECTION} mb-0`}>
                  Fields
                  {config.fields.length > 0 && (
                    <span className="ml-1.5 text-[#555] normal-case font-normal">
                      ({config.fields.length})
                    </span>
                  )}
                </p>
                {config.fields.length > 1 && (
                  <button
                    onClick={toggleAll}
                    className="text-[#555] hover:text-[#999] text-[11px] transition-colors"
                  >
                    {allExpanded ? "Collapse all" : "Expand all"}
                  </button>
                )}
              </div>

              {/* Add field button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAddMenu((v) => !v)}
                  className="flex items-center gap-1.5 text-[#FF2D1A] hover:text-[#ff5040] text-[13px] font-semibold transition-colors"
                >
                  <span className="text-[16px] leading-none">+</span> Add field
                </button>

                {showAddMenu && (
                  <div className="absolute right-0 top-7 z-20 bg-[#1c1c1c] border border-[#383838] rounded-xl overflow-hidden shadow-xl min-w-[150px]">
                    {FIELD_TYPES.map(({ type, label }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addField(type)}
                        className="w-full text-left px-4 py-2.5 text-[14px] text-[#ccc] hover:bg-[#2a2a2a] hover:text-white transition-colors flex items-center gap-2.5"
                      >
                        <span className={`text-[11px] font-semibold rounded px-1.5 py-0.5 ${TYPE_COLORS[type]}`}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Field list with drag-and-drop */}
            {config.fields.length === 0 ? (
              <div className="border-2 border-dashed border-[#2a2a2a] rounded-xl py-10 text-center">
                <p className="text-[#555] text-[13px] mb-1">No fields yet</p>
                <p className="text-[#3a3a3a] text-[12px]">Click &quot;+ Add field&quot; to start building</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={config.fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {config.fields.map((field) => (
                      <SortableFieldCard
                        key={field.id}
                        field={field}
                        expanded={expandedFields.has(field.id)}
                        onToggle={() => toggleExpand(field.id)}
                        onDelete={deleteField}
                        onChange={updateField}
                      />
                    ))}
                  </div>
                </SortableContext>

                {/* Drag overlay — shows ghost card while dragging */}
                <DragOverlay>
                  {activeField && (
                    <FieldCardContent
                      field={activeField}
                      expanded={false}
                      onToggle={() => {}}
                      onDelete={() => {}}
                      onChange={() => {}}
                      isDragging={true}
                    />
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>

          {/* Style section */}
          <div className="px-5 pt-4 pb-6 border-t border-[#2a2a2a] space-y-4">
            <p className={SECTION}>Style</p>

            <div>
              <label className="block text-[#999] text-[12px] mb-2">Button color</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={config.styles.primaryColor}
                  onChange={(e) => updateStyle("primaryColor", e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent p-0"
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
              <label className="block text-[#999] text-[12px] mb-2">Button text</label>
              <input
                value={config.styles.buttonText}
                onChange={(e) => updateStyle("buttonText", e.target.value)}
                className={INPUT_CLS}
                placeholder="Get a Free Quote"
              />
            </div>

            <div>
              <label className="block text-[#999] text-[12px] mb-2">Success message</label>
              <input
                value={config.styles.successMessage}
                onChange={(e) => updateStyle("successMessage", e.target.value)}
                className={INPUT_CLS}
                placeholder="Thanks! We'll call you within 60 seconds."
              />
            </div>
          </div>
        </div>

        {/* ── Right: Preview + Embed ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live preview */}
          <div>
            <p className={SECTION}>Live preview</p>
            <div className="bg-white rounded-xl border border-[#383838] overflow-hidden shadow-sm">
              {config.fields.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-300 text-[14px]">Add fields to see a preview</p>
                </div>
              ) : (
                <div className="px-6 py-7 space-y-4 max-w-[460px]">
                  {config.fields.map((field) => (
                    <div key={field.id}>
                      {field.type !== "checkbox" && (
                        <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                          {field.label || "Untitled"}
                          {field.required && <span className="text-red-400 ml-0.5">*</span>}
                        </div>
                      )}
                      {field.type === "textarea" ? (
                        <div className="w-full border border-gray-100 rounded-lg px-3.5 py-2.5 bg-gray-50 min-h-[72px]" />
                      ) : field.type === "checkbox" ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 border border-gray-300 rounded flex-shrink-0" />
                          <span className="text-gray-400 text-[13px]">{field.label}</span>
                        </div>
                      ) : field.type === "select" ? (
                        <div className="w-full border border-gray-100 rounded-lg px-3.5 py-2.5 bg-gray-50 flex items-center justify-between text-gray-300 text-[13px]">
                          <span>Select an option…</span>
                          <span>▾</span>
                        </div>
                      ) : (
                        <div className="w-full border border-gray-100 rounded-lg px-3.5 py-2.5 bg-gray-50 text-gray-300 text-[13px]">
                          {field.placeholder || ""}
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    className="w-full py-3 rounded-lg text-white text-center font-semibold text-[14px]"
                    style={{ backgroundColor: config.styles.primaryColor }}
                  >
                    {config.styles.buttonText || "Submit"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Embed code */}
          <div>
            <p className={SECTION}>Embed code</p>
            <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl p-4">
              <p className="text-[#999] text-[12px] mb-3 leading-relaxed">
                Paste into any webpage. Adjust <span className="text-[#bbb] font-mono">height</span> to fit your form length.
              </p>
              <pre className="text-[#aaa] text-[11px] font-mono bg-[#0C0C0C] border border-[#2a2a2a] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {`<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="520"\n  frameborder="0"\n  style="border: none; border-radius: 8px;"\n></iframe>`}
              </pre>
              <button
                onClick={copyEmbed}
                className="mt-3 px-3.5 py-1.5 bg-[#2e2e2e] hover:bg-[#383838] text-[#ccc] text-[13px] font-medium rounded-lg transition-colors"
              >
                {copied ? "Copied!" : "Copy embed code"}
              </button>
            </div>

            <div className="mt-3 bg-[#1c1c1c] border border-[#383838] rounded-xl p-4">
              <p className="text-[#999] text-[12px] mb-1 font-medium">Direct link</p>
              <p className="text-[#555] text-[12px] font-mono break-all">{embedUrl}</p>
              <p className="text-[#444] text-[11px] mt-1.5">Open this URL to test your form before embedding.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
