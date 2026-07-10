import { NextResponse } from "next/server";
import { z } from "zod";

import { handleApiError } from "@/lib/api-response";
import { selectTopicForProject } from "@/services/project-service";

const selectTopicSchema = z.object({
  topicId: z.string().min(1),
});

type TopicSelectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: TopicSelectRouteContext) {
  try {
    const { id } = await context.params;
    const { topicId } = selectTopicSchema.parse(await request.json());
    const project = await selectTopicForProject(id, topicId);
    return NextResponse.json({ project });
  } catch (error) {
    return handleApiError(error);
  }
}
