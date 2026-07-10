import type { ContentStyle, Platform } from "@prisma/client";

import type { SelectedTopic } from "@/types/project";

export type PublishPromptInput = {
  name: string;
  direction: string;
  platform: Platform;
  style: ContentStyle;
  audience: string;
  selectedTopic: SelectedTopic;
  script: string;
};

export const publishAgentSystemPrompt = [
  "You are a multi-platform publish optimization agent for individual creators.",
  "You turn finished scripts into publish-ready titles, descriptions, hashtags, and post copy.",
  "Adapt the output to the target platform.",
  "Return only the requested structured JSON.",
].join("\n");

export function buildPublishAgentUserPrompt(input: PublishPromptInput) {
  return [
    "Create publish content for this creator project.",
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
    "Video script:",
    input.script,
    "",
    "Platform rules:",
    "- BILIBILI: information-dense title, slightly longer description, knowledge/tutorial tags.",
    "- DOUYIN: short title with benefit or contrast, conversational copy, save/comment/follow CTA.",
    "- XIAOHONGSHU: practical note style, lifestyle-friendly title, concrete hashtags.",
    "",
    "Requirements:",
    "1. platform must equal the target platform exactly.",
    "2. hashtags must be an array of short strings.",
    "3. title, description, hashtags, and copy must be consistent with the script.",
    "4. Do not invent real-time data or fake sources.",
  ].join("\n");
}
