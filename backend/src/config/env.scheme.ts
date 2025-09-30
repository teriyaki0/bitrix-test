import * as dotenv from "dotenv";
import path from "path";
import { z } from "zod";

const envFilePath = path.resolve(process.cwd(), `.env`);
dotenv.config({ path: envFilePath });

const envSchema = z.object({
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  PORT: z.coerce.number().default(4000),
  BITRIX_WEBHOOK_URL: z.string(),

  BITRIX_DEVICES_SECTION_ID: z.coerce.number(),
  BITRIX_PARTS_SECTION_ID: z.coerce.number(),
  BITRIX_SERVICES_SECTION_ID: z.coerce.number(),
});

export type EnvConfig = z.infer<typeof envSchema>;

const validatedEnv: EnvConfig = envSchema.parse(process.env);

export { validatedEnv };
