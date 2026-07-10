"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { WorkspaceProject } from "@/components/project/workspace-shell";
import type { WorkspaceStepState } from "@/lib/project-status";

type ScriptStepProps = {
  project: WorkspaceProject;
  state: WorkspaceStepState;
};

export function ScriptStep({ project, state }: ScriptStepProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function generateScript() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/projects/${project.id}/script/generate`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error?.message ?? "Failed to generate script.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <>
      <StepNotice state={state} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={state === "locked" || isPending}
          onClick={generateScript}
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Generating..." : "Generate Video Script"}
        </button>
        {project.script ? (
          <p className="text-sm text-slate-500">
            Regenerating script will replace the current draft.
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <TextPreview
        value={project.script}
        empty="Generate research before creating a script."
      />
    </>
  );
}

function TextPreview({ value, empty }: { value: string | null; empty: string }) {
  if (!value) {
    return <p className="text-sm text-slate-500">{empty}</p>;
  }

  return (
    <pre className="whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
      {value}
    </pre>
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
