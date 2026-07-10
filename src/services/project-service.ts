import { Prisma, ProjectStatus } from "@prisma/client";

import { AppError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import type { ProjectInput } from "@/lib/validations/project";
import {
  generatePublishContent,
  generateResearchNote,
  generateTopicSuggestions,
  generateVideoScript,
} from "@/services/ai-service";
import type { SelectedTopic, StaleField } from "@/types/project";

const projectListSelect = {
  id: true,
  name: true,
  direction: true,
  platform: true,
  style: true,
  audience: true,
  status: true,
  staleFields: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect;

export type ProjectListItem = Prisma.ProjectGetPayload<{
  select: typeof projectListSelect;
}>;

const projectDetailInclude = {
  topics: {
    orderBy: {
      order: "asc",
    },
  },
} satisfies Prisma.ProjectInclude;

const resetAfterBriefChange: StaleField[] = [
  "topics",
  "selectedTopic",
  "researchNote",
  "script",
  "publishContent",
];

export async function listProjects(): Promise<ProjectListItem[]> {
  return prisma.project.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: projectListSelect,
  });
}

export async function createProject(input: ProjectInput) {
  return prisma.project.create({
    data: {
      ...input,
      status: ProjectStatus.CREATED,
      staleFields: [],
    },
  });
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: projectDetailInclude,
  });

  if (!project) {
    throw new AppError("PROJECT_NOT_FOUND", "项目不存在", 404);
  }

  return project;
}

export async function updateProject(id: string, input: ProjectInput) {
  await assertProjectExists(id);

  return prisma.$transaction(async (tx) => {
    await tx.topicSuggestion.deleteMany({
      where: {
        projectId: id,
      },
    });

    return tx.project.update({
      where: { id },
      data: {
        ...input,
        selectedTopic: Prisma.JsonNull,
        researchNote: null,
        script: null,
        publishContent: Prisma.JsonNull,
        status: ProjectStatus.CREATED,
        staleFields: resetAfterBriefChange,
      },
      include: projectDetailInclude,
    });
  });
}

export async function deleteProject(id: string) {
  await assertProjectExists(id);

  await prisma.project.delete({
    where: { id },
  });
}

export async function generateTopicsForProject(id: string) {
  const project = await getProjectById(id);
  const topics = await generateTopicSuggestions({
    name: project.name,
    direction: project.direction,
    platform: project.platform,
    style: project.style,
    audience: project.audience,
  });

  return prisma.$transaction(async (tx) => {
    await tx.topicSuggestion.deleteMany({
      where: {
        projectId: id,
      },
    });

    await tx.topicSuggestion.createMany({
      data: topics.map((topic, index) => ({
        projectId: id,
        title: topic.title,
        description: topic.description,
        reason: topic.reason,
        order: index + 1,
      })),
    });

    return tx.project.update({
      where: { id },
      data: {
        selectedTopic: Prisma.JsonNull,
        researchNote: null,
        script: null,
        publishContent: Prisma.JsonNull,
        status: ProjectStatus.TOPIC_GENERATED,
        staleFields: [],
      },
      include: projectDetailInclude,
    });
  });
}

export async function selectTopicForProject(id: string, topicId: string) {
  await assertProjectExists(id);

  const topic = await prisma.topicSuggestion.findFirst({
    where: {
      id: topicId,
      projectId: id,
    },
  });

  if (!topic) {
    throw new AppError("TOPIC_NOT_FOUND", "Topic suggestion not found.", 404);
  }

  return prisma.project.update({
    where: { id },
    data: {
      selectedTopic: {
        title: topic.title,
        description: topic.description,
        reason: topic.reason,
      },
      researchNote: null,
      script: null,
      publishContent: Prisma.JsonNull,
      status: ProjectStatus.TOPIC_SELECTED,
      staleFields: [],
    },
    include: projectDetailInclude,
  });
}

export async function generateResearchForProject(id: string) {
  const project = await getProjectById(id);
  const selectedTopic = project.selectedTopic as SelectedTopic | null;

  if (!selectedTopic) {
    throw new AppError(
      "INVALID_STATUS",
      "Select a topic before generating research.",
      400,
    );
  }

  const researchNote = await generateResearchNote({
    name: project.name,
    direction: project.direction,
    platform: project.platform,
    style: project.style,
    audience: project.audience,
    selectedTopic,
  });

  return prisma.project.update({
    where: { id },
    data: {
      researchNote,
      script: null,
      publishContent: Prisma.JsonNull,
      status: ProjectStatus.RESEARCH_DONE,
      staleFields: [],
    },
    include: projectDetailInclude,
  });
}

export async function generateScriptForProject(id: string) {
  const project = await getProjectById(id);
  const selectedTopic = project.selectedTopic as SelectedTopic | null;

  if (!selectedTopic || !project.researchNote) {
    throw new AppError(
      "INVALID_STATUS",
      "Generate research before generating a script.",
      400,
    );
  }

  const script = await generateVideoScript({
    name: project.name,
    direction: project.direction,
    platform: project.platform,
    style: project.style,
    audience: project.audience,
    selectedTopic,
    researchNote: project.researchNote,
  });

  return prisma.project.update({
    where: { id },
    data: {
      script,
      publishContent: Prisma.JsonNull,
      status: ProjectStatus.SCRIPT_DONE,
      staleFields: [],
    },
    include: projectDetailInclude,
  });
}

export async function generatePublishForProject(id: string) {
  const project = await getProjectById(id);
  const selectedTopic = project.selectedTopic as SelectedTopic | null;

  if (!selectedTopic || !project.script) {
    throw new AppError(
      "INVALID_STATUS",
      "Generate a script before generating publish content.",
      400,
    );
  }

  const publishContent = await generatePublishContent({
    name: project.name,
    direction: project.direction,
    platform: project.platform,
    style: project.style,
    audience: project.audience,
    selectedTopic,
    script: project.script,
  });

  return prisma.project.update({
    where: { id },
    data: {
      publishContent,
      status: ProjectStatus.PUBLISH_DONE,
      staleFields: [],
    },
    include: projectDetailInclude,
  });
}

async function assertProjectExists(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!project) {
    throw new AppError("PROJECT_NOT_FOUND", "项目不存在", 404);
  }
}
