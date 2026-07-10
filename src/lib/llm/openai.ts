import OpenAI from "openai";

import { AppError } from "@/lib/api-response";
import { DEFAULT_OPENAI_MODEL } from "@/lib/llm/model";
import type { GenerateJsonInput, LlmProvider } from "@/lib/llm/provider";

export class OpenAiProvider implements LlmProvider {
  async generateJson<T>({ system, user, schema }: GenerateJsonInput) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new AppError(
        "AI_GENERATION_FAILED",
        "OPENAI_API_KEY is not configured.",
        500,
      );
    }

    const openai = new OpenAI({
      apiKey,
      timeout: 20_000,
    });

    try {
      const response = await openai.responses.create({
        model: DEFAULT_OPENAI_MODEL,
        input: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: user,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: schema.name,
            schema: schema.schema,
            strict: schema.strict ?? true,
          },
        },
      });

      return JSON.parse(response.output_text) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AppError(
          "AI_GENERATION_FAILED",
          "AI returned invalid JSON.",
          502,
        );
      }

      throw new AppError(
        "AI_GENERATION_FAILED",
        error instanceof Error ? error.message : "AI generation failed.",
        502,
      );
    }
  }
}
