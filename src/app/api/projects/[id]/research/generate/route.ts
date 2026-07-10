import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-response";
import { generateResearchForProject } from "@/services/project-service";

type ResearchGenerateRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: ResearchGenerateRouteContext,
) {
  try {
    const { id } = await context.params;
    const project = await generateResearchForProject(id);
    return NextResponse.json({
      project,
      researchNote: project.researchNote,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
