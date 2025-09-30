export interface Product {
  id: number;
  name: string;
  price: number | null;
  currency: string | null;
}

export interface ProductWithQuantity extends Product {
  quantity: number;
}
