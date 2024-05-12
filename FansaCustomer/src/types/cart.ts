import { product } from "./product";

export interface cart {
  id: number;
  quantity: number;
  product: product;
}

export interface checkoutInfo {
  payment: string;
  address: string;
  name: string;
  phone: string;
  total: number;
}
