"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { WorkspaceProject } from "@/components/project/workspace-shell";
import {
  contentStyleLabels,
  platformLabels,
  type ContentStyleValue,
  type PlatformValue,
} from "@/types/project";

type ProjectBriefFormProps = {
  project: WorkspaceProject;
};

const platformOptions = [
  { value: "BILIBILI", label: platformLabels.BILIBILI },
  { value: "DOUYIN", label: platformLabels.DOUYIN },
  { value: "XIAOHONGSHU", label: platformLabels.XIAOHONGSHU },
];

const styleOptions = [
  { value: "EXPLAINER", label: contentStyleLabels.EXPLAINER },
  { value: "TUTORIAL", label: contentStyleLabels.TUTORIAL },
  { value: "REVIEW", label: contentStyleLabels.REVIEW },
  { value: "STORY", label: contentStyleLabels.STORY },
  { value: "OPINION", label: contentStyleLabels.OPINION },
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
        setError(payload?.error?.message ?? "保存项目基础信息失败，请稍后重试。");
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
          <Field label="项目名称" value={project.name} />
          <Field label="目标平台" value={platformLabels[project.platform]} />
          <Field label="内容风格" value={contentStyleLabels[project.style]} />
          <Field label="目标受众" value={project.audience} />
          <div className="sm:col-span-2">
            <Field label="创作方向" value={project.direction} />
          </div>
        </dl>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            编辑基础信息
          </button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        修改基础信息后，选题、研究摘要、脚本和发布文案都会失效，需要重新生成。
      </p>

      <TextInput
        label="项目名称"
        value={form.name}
        onChange={(value) => setForm((current) => ({ ...current, name: value }))}
      />
      <TextareaInput
        label="创作方向"
        value={form.direction}
        onChange={(value) =>
          setForm((current) => ({ ...current, direction: value }))
        }
      />
      <SelectInput
        label="目标平台"
        value={form.platform}
        options={platformOptions}
        onChange={(value) =>
          setForm((current) => ({ ...current, platform: value as PlatformValue }))
        }
      />
      <SelectInput
        label="内容风格"
        value={form.style}
        options={styleOptions}
        onChange={(value) =>
          setForm((current) => ({ ...current, style: value as ContentStyleValue }))
        }
      />
      <TextInput
        label="目标受众"
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
          {isPending ? "保存中..." : "保存修改"}
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
          取消
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
