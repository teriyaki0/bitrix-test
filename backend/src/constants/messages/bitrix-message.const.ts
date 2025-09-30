export const BITRIX_MESSAGE = {
  SUCCESS: {
    HEALTH_OK: "Bitrix24 API is healthy",
    DEAL_CREATED: "Deal successfully created in Bitrix24",
    PRODUCTS_FOUND: "Products successfully retrieved from Bitrix24",
  },
  ERROR: {
    UNKNOWN: "Unknown Bitrix24 error",
    CONNECTION_FAILED: "Failed to connect to Bitrix24",
    PRODUCT_NOT_FOUND: "Product not found in Bitrix24",
    PRICE_REQUIRED: "Price is required for this product",
    CURRENCY_CONFLICT: "Currency conflict between selected products",
    VALIDATION: "Validation error: invalid payload",
  },
} as const;
