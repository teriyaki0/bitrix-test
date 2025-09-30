import { z } from "zod";

export const dealItemSchema = z.object({
  productId: z.number().min(1),
  quantity: z.number().min(1),
});

export const createDealSchema = z.object({
  device: dealItemSchema,
  parts: z.array(dealItemSchema).optional(),
  services: z.array(dealItemSchema).optional(),
});

export type CreateDealDto = z.infer<typeof createDealSchema>;
