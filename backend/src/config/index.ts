import { ERROR_MESSAGE } from "../constants/messages/error-messages.const";
import { validatedEnv } from "./env.scheme";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export interface Config {
  app: { port: number };
  bitrix: { webhook: string; deviceSectionId: number; partsSectionId: number; serviceSectionId: number };
  logging: { level: LogLevel };
}

const configs: Record<string, Config> = {
  development: {
    app: { port: validatedEnv.PORT },
    bitrix: {
      webhook: validatedEnv.BITRIX_WEBHOOK_URL,
      deviceSectionId: validatedEnv.BITRIX_DEVICES_SECTION_ID,
      partsSectionId: validatedEnv.BITRIX_PARTS_SECTION_ID,
      serviceSectionId: validatedEnv.BITRIX_SERVICES_SECTION_ID,
    },
    logging: { level: validatedEnv.LOG_LEVEL },
  },
  production: {
    app: { port: validatedEnv.PORT },
    bitrix: {
      webhook: validatedEnv.BITRIX_WEBHOOK_URL,
      deviceSectionId: validatedEnv.BITRIX_DEVICES_SECTION_ID,
      partsSectionId: validatedEnv.BITRIX_PARTS_SECTION_ID,
      serviceSectionId: validatedEnv.BITRIX_SERVICES_SECTION_ID,
    },
    logging: { level: validatedEnv.LOG_LEVEL },
  },
  test: {
    app: { port: 5001 },
    bitrix: {
      webhook: "http://localhost/test-webhook",
      deviceSectionId: validatedEnv.BITRIX_DEVICES_SECTION_ID,
      partsSectionId: validatedEnv.BITRIX_PARTS_SECTION_ID,
      serviceSectionId: validatedEnv.BITRIX_SERVICES_SECTION_ID,
    },
    logging: { level: "error" },
  },
};

const getConfig = (): Config => {
  const env = (process.env.NODE_ENV || "development") as keyof typeof configs;

  if (!configs[env]) {
    throw new Error(ERROR_MESSAGE.CONFIG_ERROR.NODE_ENV_INVALID);
  }

  return configs[env];
};

export const config = getConfig();
