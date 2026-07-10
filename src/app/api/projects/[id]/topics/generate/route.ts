import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-response";
import { generateTopicsForProject } from "@/services/project-service";

type TopicGenerateRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, context: TopicGenerateRouteContext) {
  try {
    const { id } = await context.params;
    const project = await generateTopicsForProject(id);
    return NextResponse.json({ project, topics: project.topics });
  } catch (error) {
    return handleApiError(error);
  }
}
