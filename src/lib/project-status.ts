import type { ProjectStatus } from "@prisma/client";
import type { StaleField } from "@/types/project";

export const PROJECT_STATUS_ORDER: Record<ProjectStatus, number> = {
  CREATED: 0,
  TOPIC_GENERATED: 1,
  TOPIC_SELECTED: 2,
  RESEARCH_DONE: 3,
  SCRIPT_DONE: 4,
  PUBLISH_DONE: 5,
};

export function isStatusAtLeast(
  current: ProjectStatus,
  required: ProjectStatus,
) {
  return PROJECT_STATUS_ORDER[current] >= PROJECT_STATUS_ORDER[required];
}

export type WorkspaceStepId =
  | "brief"
  | "topics"
  | "research"
  | "script"
  | "publish";

export type WorkspaceStepState = "completed" | "ready" | "locked" | "stale";

export type WorkspaceStep = {
  id: WorkspaceStepId;
  title: string;
  description: string;
  requiredStatus: ProjectStatus;
  staleField?: StaleField;
};

export const WORKSPACE_STEPS: WorkspaceStep[] = [
  {
    id: "brief",
    title: "Project Brief",
    description: "创作项目的基础信息",
    requiredStatus: "CREATED",
  },
  {
    id: "topics",
    title: "Topics",
    description: "生成并选择 1 个选题",
    requiredStatus: "CREATED",
    staleField: "topics",
  },
  {
    id: "research",
    title: "Research",
    description: "围绕选题生成研究摘要",
    requiredStatus: "TOPIC_SELECTED",
    staleField: "researchNote",
  },
  {
    id: "script",
    title: "Script",
    description: "生成可编辑视频脚本",
    requiredStatus: "RESEARCH_DONE",
    staleField: "script",
  },
  {
    id: "publish",
    title: "Publish",
    description: "生成平台发布内容",
    requiredStatus: "SCRIPT_DONE",
    staleField: "publishContent",
  },
];

export function getWorkspaceStepState(
  step: WorkspaceStep,
  status: ProjectStatus,
  staleFields: string[],
): WorkspaceStepState {
  if (step.staleField && staleFields.includes(step.staleField)) {
    return "stale";
  }

  if (!isStatusAtLeast(status, step.requiredStatus)) {
    return "locked";
  }

  if (step.id === "brief") {
    return "completed";
  }

  const completedStatusByStep: Partial<Record<WorkspaceStepId, ProjectStatus>> =
    {
      topics: "TOPIC_GENERATED",
      research: "RESEARCH_DONE",
      script: "SCRIPT_DONE",
      publish: "PUBLISH_DONE",
    };

  const completedStatus = completedStatusByStep[step.id];

  if (completedStatus && isStatusAtLeast(status, completedStatus)) {
    return "completed";
  }

  return "ready";
}

export function getStepStateLabel(state: WorkspaceStepState) {
  const labels: Record<WorkspaceStepState, string> = {
    completed: "Completed",
    ready: "Ready",
    locked: "Locked",
    stale: "Stale",
  };

  return labels[state];
}
