import type { ContentStyle, Platform } from "@prisma/client";

import type { SelectedTopic } from "@/types/project";

export type ResearchPromptInput = {
  name: string;
  direction: string;
  platform: Platform;
  style: ContentStyle;
  audience: string;
  selectedTopic: SelectedTopic;
};

export const researchAgentSystemPrompt = [
  "You are a content research agent for individual creators.",
  "You turn a selected topic into a practical research note for script writing.",
  "Write all user-facing content in Simplified Chinese.",
  "Do not claim to browse the web or use real-time data.",
  "Avoid invented statistics, fake sources, and unverifiable claims.",
  "Return only the requested structured JSON.",
].join("\n");

export function buildResearchAgentUserPrompt(input: ResearchPromptInput) {
  return [
    "Create a markdown Research Note for this creator project.",
    "",
    `Project name: ${input.name}`,
    `Direction: ${input.direction}`,
    `Target platform: ${input.platform}`,
    `Content style: ${input.style}`,
    `Target audience: ${input.audience}`,
    "",
    "Selected topic:",
    `Title: ${input.selectedTopic.title}`,
    `Description: ${input.selectedTopic.description}`,
    `Reason: ${input.selectedTopic.reason ?? "N/A"}`,
    "",
    "The researchNote value must be markdown with exactly these Chinese sections:",
    "# 研究摘要",
    "## 背景知识",
    "## 核心观点",
    "## 支撑论点",
    "## 内容大纲",
    "## 可用角度",
    "## 创作提示",
    "",
    "Requirements:",
    "1. Make the note specific enough to support script writing.",
    "2. Keep the language practical and creator-friendly.",
    "3. Do not mention real-time search, live trends, or specific sources.",
    "4. Do not invent statistics.",
    "5. Write the full note in Simplified Chinese.",
  ].join("\n");
}
