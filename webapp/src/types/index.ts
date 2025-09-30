export interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
}

export interface SelectedProduct extends Product {
  quantity: number;
}

export interface DealRequest {
  device: {
    productId: number;
    quantity: number;
  };
  parts: Array<{
    productId: number;
    quantity: number;
  }>;
  services: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface DealResponse {
  ok: boolean;
  dealId: number;
  title: string;
  rowsAdded: number;
  total: number;
}

export type SearchType = "devices" | "parts" | "services";
