-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('BILIBILI', 'DOUYIN', 'XIAOHONGSHU');

-- CreateEnum
CREATE TYPE "ContentStyle" AS ENUM ('EXPLAINER', 'TUTORIAL', 'REVIEW', 'STORY', 'OPINION');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('CREATED', 'TOPIC_GENERATED', 'TOPIC_SELECTED', 'RESEARCH_DONE', 'SCRIPT_DONE', 'PUBLISH_DONE');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "style" "ContentStyle" NOT NULL,
    "audience" TEXT NOT NULL,
    "selectedTopic" JSONB,
    "researchNote" TEXT,
    "script" TEXT,
    "publishContent" JSONB,
    "status" "ProjectStatus" NOT NULL DEFAULT 'CREATED',
    "staleFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicSuggestion" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TopicSuggestion_projectId_idx" ON "TopicSuggestion"("projectId");

-- AddForeignKey
ALTER TABLE "TopicSuggestion" ADD CONSTRAINT "TopicSuggestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
