"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { WorkspaceProject } from "@/components/project/workspace-shell";
import type { WorkspaceStepState } from "@/lib/project-status";

type ResearchStepProps = {
  project: WorkspaceProject;
  state: WorkspaceStepState;
};

export function ResearchStep({ project, state }: ResearchStepProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function generateResearch() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/projects/${project.id}/research/generate`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error?.message ?? "生成研究摘要失败，请稍后重试。");
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
          onClick={generateResearch}
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "生成中..." : "生成研究摘要"}
        </button>
        {project.researchNote ? (
          <p className="text-sm text-slate-500">
            重新生成会替换当前研究摘要。
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <TextPreview
        value={project.researchNote}
        empty="请先选择一个选题，再生成研究摘要。"
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
        请先完成上一步。
      </p>
    );
  }

  if (state === "stale") {
    return (
      <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        上游内容已修改。请重新生成当前步骤，保持项目内容一致。
      </p>
    );
  }

  return null;
}
