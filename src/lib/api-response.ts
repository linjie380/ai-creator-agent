import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_STATUS"
  | "PROJECT_NOT_FOUND"
  | "TOPIC_NOT_FOUND"
  | "AI_GENERATION_FAILED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status = 400,
) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return apiError(error.code, error.message, error.status);
  }

  if (error instanceof ZodError) {
    return apiError("INVALID_REQUEST", error.issues[0]?.message ?? "请求参数无效");
  }

  console.error(error);
  return apiError("INTERNAL_ERROR", "服务器内部错误", 500);
}
