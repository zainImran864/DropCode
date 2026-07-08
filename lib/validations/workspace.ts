import { z } from "zod";
import { LANGUAGES } from "@/lib/languages";

const languageValues = LANGUAGES.map((l) => l.value) as [string, ...string[]];

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  language: z.enum(languageValues),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
