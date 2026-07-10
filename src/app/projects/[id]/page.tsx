import Link from "next/link";
import { notFound } from "next/navigation";

import {
  WorkspaceShell,
  type WorkspaceProject,
} from "@/components/project/workspace-shell";
import { AppError } from "@/lib/api-response";
import { getProjectById } from "@/services/project-service";
import type { PublishContent, SelectedTopic } from "@/types/project";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectWorkspacePage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await loadWorkspaceProject(id);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            返回项目概览
          </Link>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Project Workspace
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {project.name}
              </h1>
            </div>
            <span className="w-fit rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
              {project.status}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <WorkspaceShell project={project} />
      </div>
    </main>
  );
}

async function loadWorkspaceProject(id: string): Promise<WorkspaceProject> {
  try {
    const project = await getProjectById(id);

    return {
      id: project.id,
      name: project.name,
      direction: project.direction,
      platform: project.platform,
      style: project.style,
      audience: project.audience,
      status: project.status,
      staleFields: project.staleFields,
      selectedTopic: project.selectedTopic as SelectedTopic | null,
      researchNote: project.researchNote,
      script: project.script,
      publishContent: project.publishContent as PublishContent | null,
      topics: project.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        reason: topic.reason,
        order: topic.order,
      })),
    };
  } catch (error) {
    if (error instanceof AppError && error.code === "PROJECT_NOT_FOUND") {
      notFound();
    }

    throw error;
  }
}
