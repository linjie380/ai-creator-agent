"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { WorkspaceProject } from "@/components/project/workspace-shell";
import type { WorkspaceStepState } from "@/lib/project-status";

type TopicStepProps = {
  project: WorkspaceProject;
  state: WorkspaceStepState;
};

export function TopicStep({ project, state }: TopicStepProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [isGenerating, startGenerating] = useTransition();
  const [isSelecting, startSelecting] = useTransition();
  const selectedTitle = project.selectedTopic?.title;

  function generateTopics() {
    setError(null);
    startGenerating(async () => {
      const response = await fetch(`/api/projects/${project.id}/topics/generate`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error?.message ?? "Failed to generate topics.");
        return;
      }

      router.refresh();
    });
  }

  function selectTopic(topicId: string) {
    setError(null);
    setActiveTopicId(topicId);
    startSelecting(async () => {
      const response = await fetch(`/api/projects/${project.id}/topics/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId }),
      });

      setActiveTopicId(null);

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error?.message ?? "Failed to select topic.");
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
          disabled={state === "locked" || isGenerating}
          onClick={generateTopics}
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isGenerating ? "Generating..." : "Generate 5 Topics"}
        </button>
        {project.topics.length > 0 ? (
          <p className="text-sm text-slate-500">
            Regenerating topics will replace the current suggestions.
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {project.topics.length > 0 ? (
        <div className="grid gap-3">
          {project.topics.map((topic) => {
            const isSelected = selectedTitle === topic.title;
            const isActive = activeTopicId === topic.id;

            return (
              <article
                key={topic.id}
                className={`rounded-md border p-4 ${
                  isSelected
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">
                      {topic.order}. {topic.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {topic.description}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Reason: {topic.reason}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSelecting || isSelected}
                    onClick={() => selectTopic(topic.id)}
                    className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSelected ? "Selected" : isActive ? "Selecting..." : "Select"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No topic suggestions yet. Generate topics to continue.
        </p>
      )}
    </>
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
