import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-response";
import { projectInputSchema } from "@/lib/validations/project";
import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/services/project-service";

type ProjectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(id);
    return NextResponse.json({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const input = projectInputSchema.parse(await request.json());
    const project = await updateProject(id, input);
    return NextResponse.json({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
