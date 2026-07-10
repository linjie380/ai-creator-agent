import Link from "next/link";

import { NewProjectForm } from "@/components/project/new-project-form";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          返回项目概览
        </Link>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">创建项目</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            新建创作项目
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            填写项目背景，让 AI 为你推荐选题，并继续完成后续创作流程。
          </p>
          <div className="mt-6">
            <NewProjectForm />
          </div>
        </section>
      </div>
    </main>
  );
}
