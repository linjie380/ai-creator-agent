"use client";

import { ContentStyle, Platform } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { WorkspaceProject } from "@/components/project/workspace-shell";

type ProjectBriefFormProps = {
  project: WorkspaceProject;
};

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

export function ProjectBriefForm({ project }: ProjectBriefFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: project.name,
    direction: project.direction,
    platform: project.platform,
    style: project.style,
    audience: project.audience,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error?.message ?? "Failed to update project brief.");
        return;
      }

      setIsEditing(false);
      router.refresh();
    });
  }

  if (!isEditing) {
    return (
      <>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Project Name" value={project.name} />
          <Field label="Platform" value={project.platform} />
          <Field label="Style" value={project.style} />
          <Field label="Audience" value={project.audience} />
          <div className="sm:col-span-2">
            <Field label="Direction" value={project.direction} />
          </div>
        </dl>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit Brief
          </button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Updating the brief resets topics, selected topic, research, script, and
        publish content.
      </p>

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
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setForm({
              name: project.name,
              direction: project.direction,
              platform: project.platform,
              style: project.style,
              audience: project.audience,
            });
            setError(null);
            setIsEditing(false);
          }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-800">{value}</dd>
    </div>
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
