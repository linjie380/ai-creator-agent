import OpenAI from "openai";

import { AppError } from "@/lib/api-response";
import { DEFAULT_DEEPSEEK_MODEL } from "@/lib/llm/model";
import type { GenerateJsonInput, LlmProvider } from "@/lib/llm/provider";

export class DeepSeekProvider implements LlmProvider {
  async generateJson<T>({ system, user, schema }: GenerateJsonInput) {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      throw new AppError(
        "AI_GENERATION_FAILED",
        "DEEPSEEK_API_KEY is not configured.",
        500,
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
      timeout: 20_000,
    });

    try {
      const response = await client.chat.completions.create({
        model: DEFAULT_DEEPSEEK_MODEL,
        messages: [
          {
            role: "system",
            content: [
              system,
              "",
              "Return valid json only.",
              `JSON schema name: ${schema.name}`,
              "JSON schema:",
              JSON.stringify(schema.schema),
            ].join("\n"),
          },
          {
            role: "user",
            content: user,
          },
        ],
        response_format: {
          type: "json_object",
        },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new AppError(
          "AI_GENERATION_FAILED",
          "DeepSeek returned empty content.",
          502,
        );
      }

      return JSON.parse(content) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AppError(
          "AI_GENERATION_FAILED",
          "DeepSeek returned invalid JSON.",
          502,
        );
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "AI_GENERATION_FAILED",
        error instanceof Error ? error.message : "DeepSeek generation failed.",
        502,
      );
    }
  }
}
