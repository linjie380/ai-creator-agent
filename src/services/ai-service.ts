import { AppError } from "@/lib/api-response";
import { llmProvider } from "@/lib/llm";
import {
  buildPublishAgentUserPrompt,
  publishAgentSystemPrompt,
  type PublishPromptInput,
} from "@/lib/prompts/publish-agent";
import {
  buildResearchAgentUserPrompt,
  researchAgentSystemPrompt,
  type ResearchPromptInput,
} from "@/lib/prompts/research-agent";
import {
  buildScriptAgentUserPrompt,
  scriptAgentSystemPrompt,
  type ScriptPromptInput,
} from "@/lib/prompts/script-agent";
import {
  buildTopicAgentUserPrompt,
  topicAgentSystemPrompt,
  type TopicPromptInput,
} from "@/lib/prompts/topic-agent";
import {
  publishAgentJsonSchema,
  publishAgentOutputSchema,
  type PublishAgentOutput,
  researchAgentJsonSchema,
  researchAgentOutputSchema,
  type ResearchAgentOutput,
  scriptAgentJsonSchema,
  scriptAgentOutputSchema,
  type ScriptAgentOutput,
  topicAgentJsonSchema,
  topicAgentOutputSchema,
  type TopicAgentOutput,
} from "@/lib/validations/ai";

export async function generateTopicSuggestions(input: TopicPromptInput) {
  const result = await llmProvider.generateJson<TopicAgentOutput>({
    system: topicAgentSystemPrompt,
    user: buildTopicAgentUserPrompt(input),
    schema: topicAgentJsonSchema,
  });

  const parsed = topicAgentOutputSchema.safeParse(result);

  if (!parsed.success) {
    throw new AppError(
      "AI_GENERATION_FAILED",
      "AI topic output did not match the expected schema.",
      502,
    );
  }

  return parsed.data.topics;
}

export async function generateResearchNote(input: ResearchPromptInput) {
  const result = await llmProvider.generateJson<ResearchAgentOutput>({
    system: researchAgentSystemPrompt,
    user: buildResearchAgentUserPrompt(input),
    schema: researchAgentJsonSchema,
  });

  const parsed = researchAgentOutputSchema.safeParse(result);

  if (!parsed.success) {
    throw new AppError(
      "AI_GENERATION_FAILED",
      "AI research output did not match the expected schema.",
      502,
    );
  }

  return parsed.data.researchNote;
}

export async function generateVideoScript(input: ScriptPromptInput) {
  const result = await llmProvider.generateJson<ScriptAgentOutput>({
    system: scriptAgentSystemPrompt,
    user: buildScriptAgentUserPrompt(input),
    schema: scriptAgentJsonSchema,
  });

  const parsed = scriptAgentOutputSchema.safeParse(result);

  if (!parsed.success) {
    throw new AppError(
      "AI_GENERATION_FAILED",
      "AI script output did not match the expected schema.",
      502,
    );
  }

  return parsed.data.script;
}

export async function generatePublishContent(input: PublishPromptInput) {
  const result = await llmProvider.generateJson<PublishAgentOutput>({
    system: publishAgentSystemPrompt,
    user: buildPublishAgentUserPrompt(input),
    schema: publishAgentJsonSchema,
  });

  const parsed = publishAgentOutputSchema.safeParse(result);

  if (!parsed.success) {
    throw new AppError(
      "AI_GENERATION_FAILED",
      "AI publish output did not match the expected schema.",
      502,
    );
  }

  return parsed.data;
}
