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

export const platformLabels: Record<PlatformValue, string> = {
  BILIBILI: "B站",
  DOUYIN: "抖音",
  XIAOHONGSHU: "小红书",
};

export const contentStyleLabels: Record<ContentStyleValue, string> = {
  EXPLAINER: "科普",
  TUTORIAL: "教程",
  REVIEW: "测评",
  STORY: "故事",
  OPINION: "观点",
};

export const projectStatusLabels: Record<ProjectStatusValue, string> = {
  CREATED: "已创建",
  TOPIC_GENERATED: "已生成选题",
  TOPIC_SELECTED: "已选择选题",
  RESEARCH_DONE: "已完成研究",
  SCRIPT_DONE: "已完成脚本",
  PUBLISH_DONE: "已生成发布文案",
};
