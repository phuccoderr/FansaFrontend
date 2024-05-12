export interface order {
  id: number;
  address: string;
  name: string;
  order_time: string;
  payment: string;
  phone: string;
  total: number;
  order_details: orderDetails[];
}

interface orderDetails {
  id: number;
  quantity: number;
  total: number;
  product_cost: number;
}
