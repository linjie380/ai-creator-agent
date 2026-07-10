import type { Platform } from "@prisma/client";

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
  platform: Platform;
  title: string;
  description: string;
  hashtags: string[];
  copy: string;
};
