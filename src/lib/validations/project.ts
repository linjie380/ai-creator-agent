import { ContentStyle, Platform } from "@prisma/client";
import { z } from "zod";

const requiredText = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field}不能为空`)
    .max(500, `${field}不能超过 500 个字符`);

export const projectInputSchema = z.object({
  name: requiredText("项目名称").max(120, "项目名称不能超过 120 个字符"),
  direction: requiredText("创作方向"),
  platform: z.enum(Platform, { message: "目标平台无效" }),
  style: z.enum(ContentStyle, { message: "内容风格无效" }),
  audience: requiredText("目标受众").max(200, "目标受众不能超过 200 个字符"),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
