import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api-response";
import { projectInputSchema } from "@/lib/validations/project";
import { createProject, listProjects } from "@/services/project-service";

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = projectInputSchema.parse(await request.json());
    const project = await createProject(input);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
