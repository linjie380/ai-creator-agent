import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-response";
import { generateScriptForProject } from "@/services/project-service";

type ScriptGenerateRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: ScriptGenerateRouteContext,
) {
  try {
    const { id } = await context.params;
    const project = await generateScriptForProject(id);
    return NextResponse.json({
      project,
      script: project.script,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
