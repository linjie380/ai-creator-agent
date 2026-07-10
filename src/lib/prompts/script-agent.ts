import type { ContentStyle, Platform } from "@prisma/client";

import type { SelectedTopic } from "@/types/project";

export type ScriptPromptInput = {
  name: string;
  direction: string;
  platform: Platform;
  style: ContentStyle;
  audience: string;
  selectedTopic: SelectedTopic;
  researchNote: string;
};

export const scriptAgentSystemPrompt = [
  "You are a video script agent for individual creators.",
  "You turn research notes into practical, spoken, editable scripts.",
  "The script must be useful for filming or recording.",
  "Write all user-facing content in Simplified Chinese.",
  "Do not invent real-time data, fake sources, or unsupported statistics.",
  "Return only the requested structured JSON.",
].join("\n");

export function buildScriptAgentUserPrompt(input: ScriptPromptInput) {
  return [
    "Create a markdown video script for this creator project.",
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
    "Research Note:",
    input.researchNote,
    "",
    "The script value must be markdown with exactly these Chinese sections:",
    "# 视频脚本",
    "## 开场 Hook",
    "## 正文脚本",
    "### 第一部分",
    "### 第二部分",
    "### 第三部分",
    "## 结尾总结",
    "## 互动引导",
    "",
    "Requirements:",
    "1. Make the opening hook strong enough for the first 5 seconds.",
    "2. Use spoken, creator-friendly language.",
    "3. Keep the structure clear and easy to edit.",
    "4. Avoid sounding like an essay.",
    "5. Include a practical CTA for likes, comments, saves, or follows.",
    "6. Write the full script in Simplified Chinese.",
  ].join("\n");
}
