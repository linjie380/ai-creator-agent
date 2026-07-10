import { DeepSeekProvider } from "@/lib/llm/deepseek";
import { getDefaultLlmProvider } from "@/lib/llm/model";
import { MockProvider } from "@/lib/llm/mock";
import { OpenAiProvider } from "@/lib/llm/openai";
import type { LlmProvider } from "@/lib/llm/provider";

export function createLlmProvider(): LlmProvider {
  const provider = getDefaultLlmProvider();

  if (provider === "openai") {
    return new OpenAiProvider();
  }

  if (provider === "deepseek") {
    return new DeepSeekProvider();
  }

  return new MockProvider();
}

export const llmProvider = createLlmProvider();
