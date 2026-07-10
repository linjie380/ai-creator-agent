export const PLATFORMS = ["BILIBILI", "DOUYIN", "XIAOHONGSHU"] as const;

export type PlatformValue = (typeof PLATFORMS)[number];

export const CONTENT_STYLES = [
  "EXPLAINER",
  "TUTORIAL",
  "REVIEW",
  "STORY",
  "OPINION",
] as const;

export type ContentStyleValue = (typeof CONTENT_STYLES)[number];

export type ProjectStatusValue =
  | "CREATED"
  | "TOPIC_GENERATED"
  | "TOPIC_SELECTED"
  | "RESEARCH_DONE"
  | "SCRIPT_DONE"
  | "PUBLISH_DONE";

export type StaleField =
  | "topics"
  | "selectedTopic"
  | "researchNote"
  | "script"
  | "publishContent";

export type SelectedTopic = {
  title: string;
  description: string;
  reason?: string;
};

export type PublishContent = {
  platform: PlatformValue;
  title: string;
  description: string;
  hashtags: string[];
  copy: string;
};
