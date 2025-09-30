enum COMMON {
  INTERNAL_SERVER_ERROR = "Something went wrong on the server.",
  HANDLED_ERROR = "Handled error.",
  REQUEST_FAILED = "Request failed.",
  FORBIDDEN = "Forbidden.",
  VALIDATION_ERROR = "Validation failed.",
  EVERY_FIELD_REQUIRED = "Every field is required.",
  ONLY_IMAGE_ALLOWED = "Only image files are allowed.",
  INVALID_TIME_FORMAT = "Invalid time format.",
}

enum CONFIG_ERROR {
  NODE_ENV_REQUIRED = "NODE_ENV must be specified. Expected values: development, production, test.",
  NODE_ENV_INVALID = "Unsupported NODE_ENV value. Expected: development, production, test.",
}

export const ERROR_MESSAGE = {
  COMMON,
  CONFIG_ERROR,
};
