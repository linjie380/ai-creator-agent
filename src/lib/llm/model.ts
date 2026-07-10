export const DEFAULT_OPENAI_MODEL =
  process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";

export type LlmProviderName = "mock" | "openai" | "deepseek";

export const DEFAULT_DEEPSEEK_MODEL =
  process.env.DEEPSEEK_MODEL?.trim() || "deepseek-v4-flash";

export function getDefaultLlmProvider(): LlmProviderName {
  if (process.env.LLM_PROVIDER === "openai") {
    return "openai";
  }

  if (process.env.LLM_PROVIDER === "deepseek") {
    return "deepseek";
  }

  return "mock";
}
