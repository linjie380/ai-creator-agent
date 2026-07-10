"use client";

import { ContentStyle, Platform } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const platformOptions = [
  { value: Platform.BILIBILI, label: "Bilibili" },
  { value: Platform.DOUYIN, label: "Douyin" },
  { value: Platform.XIAOHONGSHU, label: "Xiaohongshu" },
];

const styleOptions = [
  { value: ContentStyle.EXPLAINER, label: "Explainer" },
  { value: ContentStyle.TUTORIAL, label: "Tutorial" },
  { value: ContentStyle.REVIEW, label: "Review" },
  { value: ContentStyle.STORY, label: "Story" },
  { value: ContentStyle.OPINION, label: "Opinion" },
];

export function NewProjectForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<{
    name: string;
    direction: string;
    platform: Platform;
    style: ContentStyle;
    audience: string;
  }>({
    name: "",
    direction: "",
    platform: Platform.BILIBILI,
    style: ContentStyle.TUTORIAL,
    audience: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error?.message ?? "Failed to create project.");
        return;
      }

      router.push(`/projects/${payload.project.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Project Name"
        value={form.name}
        onChange={(value) => setForm((current) => ({ ...current, name: value }))}
      />
      <TextareaInput
        label="Direction"
        value={form.direction}
        onChange={(value) =>
          setForm((current) => ({ ...current, direction: value }))
        }
      />
      <SelectInput
        label="Platform"
        value={form.platform}
        options={platformOptions}
        onChange={(value) =>
          setForm((current) => ({ ...current, platform: value as Platform }))
        }
      />
      <SelectInput
        label="Style"
        value={form.style}
        options={styleOptions}
        onChange={(value) =>
          setForm((current) => ({ ...current, style: value as ContentStyle }))
        }
      />
      <TextInput
        label="Audience"
        value={form.audience}
        onChange={(value) =>
          setForm((current) => ({ ...current, audience: value }))
        }
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Creating..." : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
      />
    </label>
  );
}

function TextareaInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-1 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
