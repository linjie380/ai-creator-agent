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
        setError(payload?.error?.message ?? "生成发布文案失败，请稍后重试。");
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
          {isPending ? "生成中..." : "生成发布文案"}
        </button>
        {publishContent ? (
          <p className="text-sm text-slate-500">
            重新生成会替换当前发布文案。
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
            label="标题"
            value={publishContent.title}
            copied={copiedField === "title"}
            onCopy={() => copyValue("title", publishContent.title)}
          />
          <CopyField
            label="简介"
            value={publishContent.description}
            copied={copiedField === "description"}
            onCopy={() => copyValue("description", publishContent.description)}
          />
          <CopyField
            label="标签"
            value={publishContent.hashtags.join(", ")}
            copied={copiedField === "hashtags"}
            onCopy={() =>
              copyValue("hashtags", publishContent.hashtags.join(", "))
            }
          />
          <CopyField
            label="发布文案"
            value={publishContent.copy}
            copied={copiedField === "copy"}
            onCopy={() => copyValue("copy", publishContent.copy)}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          请先生成视频脚本，再生成发布文案。
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
          {copied ? "已复制" : "复制"}
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
