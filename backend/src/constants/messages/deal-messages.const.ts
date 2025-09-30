export const DEAL_ERROR = {
  DEVICE_NOT_FOUND: "Device not found",
  PART_NOT_FOUND: (id: number) => `Part ${id} not found`,
  SERVICE_NOT_FOUND: (id: number) => `Service ${id} not found`,
  NO_PRICE: (id: number) => `Item ${id} has no price`,
  INVALID_QUANTITY: "Quantity must be >= 1",
  CREATE_FAILED: "Failed to create deal",
};
