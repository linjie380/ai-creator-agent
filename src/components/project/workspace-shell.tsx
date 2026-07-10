import { ProjectBriefForm } from "@/components/project/project-brief-form";
import { PublishStep } from "@/components/project/publish-step";
import { ResearchStep } from "@/components/project/research-step";
import { ScriptStep } from "@/components/project/script-step";
import { TopicStep } from "@/components/project/topic-step";
import {
  getStepStateLabel,
  getWorkspaceStepState,
  WORKSPACE_STEPS,
  type WorkspaceStepState,
} from "@/lib/project-status";
import type { PublishContent, SelectedTopic } from "@/types/project";
import type {
  ContentStyleValue,
  PlatformValue,
  ProjectStatusValue,
} from "@/types/project";

type TopicSuggestionPreview = {
  id: string;
  title: string;
  description: string;
  reason: string;
  order: number;
};

export type WorkspaceProject = {
  id: string;
  name: string;
  direction: string;
  platform: PlatformValue;
  style: ContentStyleValue;
  audience: string;
  status: ProjectStatusValue;
  staleFields: string[];
  topics: TopicSuggestionPreview[];
  selectedTopic: SelectedTopic | null;
  researchNote: string | null;
  script: string | null;
  publishContent: PublishContent | null;
};

type WorkspaceShellProps = {
  project: WorkspaceProject;
};

const stateStyles: Record<WorkspaceStepState, string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ready: "border-slate-300 bg-white text-slate-700",
  locked: "border-slate-200 bg-slate-100 text-slate-400",
  stale: "border-amber-200 bg-amber-50 text-amber-700",
};

export function WorkspaceShell({ project }: WorkspaceShellProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          创作流程
        </p>
        <nav className="mt-4 space-y-2">
          {WORKSPACE_STEPS.map((step) => {
            const state = getWorkspaceStepState(
              step,
              project.status,
              project.staleFields,
            );

            return (
              <a
                key={step.id}
                href={`#${step.id}`}
                className="block rounded-md border border-slate-200 p-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-950">
                    {step.title}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-1 text-[11px] font-medium ${stateStyles[state]}`}
                  >
                    {getStepStateLabel(state)}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {step.description}
                </p>
              </a>
            );
          })}
        </nav>
      </aside>

      <section className="space-y-5">
        <BriefPanel project={project} />
        <TopicsPanel project={project} />
        <ResearchPanel project={project} />
        <ScriptPanel project={project} />
        <PublishPanel project={project} />
      </section>
    </div>
  );
}

function BriefPanel({ project }: WorkspaceShellProps) {
  return (
    <Panel id="brief" title="基础信息">
      <ProjectBriefForm project={project} />
    </Panel>
  );
}

function TopicsPanel({ project }: WorkspaceShellProps) {
  const state = getWorkspaceStepState(
    WORKSPACE_STEPS[1],
    project.status,
    project.staleFields,
  );

  return (
    <Panel id="topics" title="选题">
      <TopicStep project={project} state={state} />
    </Panel>
  );
}

function ResearchPanel({ project }: WorkspaceShellProps) {
  const state = getWorkspaceStepState(
    WORKSPACE_STEPS[2],
    project.status,
    project.staleFields,
  );

  return (
    <Panel id="research" title="资料研究">
      <ResearchStep project={project} state={state} />
    </Panel>
  );
}

function ScriptPanel({ project }: WorkspaceShellProps) {
  const state = getWorkspaceStepState(
    WORKSPACE_STEPS[3],
    project.status,
    project.staleFields,
  );

  return (
    <Panel id="script" title="视频脚本">
      <ScriptStep project={project} state={state} />
    </Panel>
  );
}

function PublishPanel({ project }: WorkspaceShellProps) {
  const state = getWorkspaceStepState(
    WORKSPACE_STEPS[4],
    project.status,
    project.staleFields,
  );

  return (
    <Panel id="publish" title="发布文案">
      <PublishStep project={project} state={state} />
    </Panel>
  );
}

function Panel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="scroll-mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </article>
  );
}
