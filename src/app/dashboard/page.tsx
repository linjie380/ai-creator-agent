import Link from "next/link";

import { listProjects, type ProjectListItem } from "@/services/project-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const projects = await listProjects();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-slate-500">
              AI Creator Agent
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Project Dashboard
            </h1>
          </div>
          <Link
            href="/projects/new"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            New Project
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <p className="mt-1 text-sm text-slate-500">
            Continue an existing creator workflow or start a new project.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-4">
            {projects.map((project: ProjectListItem) => (
              <article
                key={project.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{project.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {project.direction}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                      <Badge>{project.platform}</Badge>
                      <Badge>{project.style}</Badge>
                      <Badge>{project.status}</Badge>
                      <Badge>{formatDate(project.updatedAt)}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-base font-semibold">No projects yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Create your first project to generate topics, research, scripts,
              and publish copy.
            </p>
            <Link
              href="/projects/new"
              className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              New Project
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-slate-100 px-2 py-1">{children}</span>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
