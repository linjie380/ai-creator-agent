import type { ContentStyle, Platform } from "@prisma/client";

export type TopicPromptInput = {
  name: string;
  direction: string;
  platform: Platform;
  style: ContentStyle;
  audience: string;
};

export const topicAgentSystemPrompt = [
  "You are a senior content strategy agent for individual creators.",
  "You design practical video or post topics for platforms like Bilibili, Douyin, and Xiaohongshu.",
  "Write all user-facing content in Simplified Chinese.",
  "Do not claim to use real-time trends, live search, or external data.",
  "Return only the requested structured JSON.",
].join("\n");

export function buildTopicAgentUserPrompt(input: TopicPromptInput) {
  return [
    "Generate exactly 5 distinct topic suggestions for this creator project.",
    "",
    `Project name: ${input.name}`,
    `Direction: ${input.direction}`,
    `Target platform: ${input.platform}`,
    `Content style: ${input.style}`,
    `Target audience: ${input.audience}`,
    "",
    "Requirements:",
    "1. The 5 topics must have clearly different angles.",
    "2. Each topic must fit the target platform and audience.",
    "3. Titles should be specific enough to become a video or post.",
    "4. The reason should explain why the topic is worth choosing.",
    "5. Do not mention real-time search or live trending data.",
    "6. Write titles, descriptions, and reasons in Simplified Chinese.",
  ].join("\n");
}
