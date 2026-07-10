import { Platform } from "@prisma/client";
import { z } from "zod";

export const topicAgentOutputSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        reason: z.string().min(1),
      }),
    )
    .length(5),
});

export type TopicAgentOutput = z.infer<typeof topicAgentOutputSchema>;

export const topicAgentJsonSchema = {
  name: "topic_agent_output",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["topics"],
    properties: {
      topics: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "description", "reason"],
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            reason: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

export const researchAgentOutputSchema = z.object({
  researchNote: z.string().min(1),
});

export type ResearchAgentOutput = z.infer<typeof researchAgentOutputSchema>;

export const researchAgentJsonSchema = {
  name: "research_agent_output",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["researchNote"],
    properties: {
      researchNote: {
        type: "string",
      },
    },
  },
};

export const scriptAgentOutputSchema = z.object({
  script: z.string().min(1),
});

export type ScriptAgentOutput = z.infer<typeof scriptAgentOutputSchema>;

export const scriptAgentJsonSchema = {
  name: "script_agent_output",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["script"],
    properties: {
      script: {
        type: "string",
      },
    },
  },
};

export const publishAgentOutputSchema = z.object({
  platform: z.enum(Platform),
  title: z.string().min(1),
  description: z.string().min(1),
  hashtags: z.array(z.string().min(1)).min(1),
  copy: z.string().min(1),
});

export type PublishAgentOutput = z.infer<typeof publishAgentOutputSchema>;

export const publishAgentJsonSchema = {
  name: "publish_agent_output",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["platform", "title", "description", "hashtags", "copy"],
    properties: {
      platform: {
        type: "string",
        enum: ["BILIBILI", "DOUYIN", "XIAOHONGSHU"],
      },
      title: {
        type: "string",
      },
      description: {
        type: "string",
      },
      hashtags: {
        type: "array",
        items: {
          type: "string",
        },
      },
      copy: {
        type: "string",
      },
    },
  },
};
