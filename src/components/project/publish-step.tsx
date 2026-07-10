"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { WorkspaceProject } from "@/components/project/workspace-shell";
import type { WorkspaceStepState } from "@/lib/project-status";

type PublishStepProps = {
  project: WorkspaceProject;
  state: WorkspaceStepState;
};

export function PublishStep({ project, state }: PublishStepProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function generatePublishContent() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/projects/${project.id}/publish/generate`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error?.message ?? "Failed to generate publish content.");
        return;
      }

      router.refresh();
    });
  }

  async function copyValue(field: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1200);
  }

  const publishContent = project.publishContent;

  return (
    <>
      <StepNotice state={state} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={state === "locked" || isPending}
          onClick={generatePublishContent}
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Generating..." : "Generate Publish Content"}
        </button>
        {publishContent ? (
          <p className="text-sm text-slate-500">
            Regenerating publish content will replace the current copy.
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {publishContent ? (
        <div className="grid gap-3">
          <CopyField
            label="Title"
            value={publishContent.title}
            copied={copiedField === "title"}
            onCopy={() => copyValue("title", publishContent.title)}
          />
          <CopyField
            label="Description"
            value={publishContent.description}
            copied={copiedField === "description"}
            onCopy={() => copyValue("description", publishContent.description)}
          />
          <CopyField
            label="Hashtags"
            value={publishContent.hashtags.join(", ")}
            copied={copiedField === "hashtags"}
            onCopy={() =>
              copyValue("hashtags", publishContent.hashtags.join(", "))
            }
          />
          <CopyField
            label="Copy"
            value={publishContent.copy}
            copied={copiedField === "copy"}
            onCopy={() => copyValue("copy", publishContent.copy)}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Generate a script before creating publish content.
        </p>
      )}
    </>
  );
}

function CopyField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-xs font-medium text-slate-500">{label}</dt>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
        {value}
      </dd>
    </div>
  );
}

function StepNotice({ state }: { state: WorkspaceStepState }) {
  if (state === "locked") {
    return (
      <p className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
        Complete the previous step first.
      </p>
    );
  }

  if (state === "stale") {
    return (
      <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Upstream content changed. Regenerate this step to keep the project
        consistent.
      </p>
    );
  }

  return null;
}
