import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-response";
import { generatePublishForProject } from "@/services/project-service";

type PublishGenerateRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: PublishGenerateRouteContext,
) {
  try {
    const { id } = await context.params;
    const project = await generatePublishForProject(id);
    return NextResponse.json({
      project,
      publishContent: project.publishContent,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
