export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type GenerateJsonInput = {
  system: string;
  user: string;
  schema: JsonSchema;
};

export interface LlmProvider {
  generateJson<T>(input: GenerateJsonInput): Promise<T>;
}
