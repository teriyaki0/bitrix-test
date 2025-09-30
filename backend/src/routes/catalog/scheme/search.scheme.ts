import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string(),
});

export type SearchQueryDto = z.infer<typeof searchQuerySchema>;
