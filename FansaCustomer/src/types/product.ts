export interface product {
  id: number;
  name: string;
  alias: string;
  main_image: string;
  short_description: string;
  full_description: string;
  cost: number;
  price: number;
  sale: number;
  category?: object;
  product_images: images[];
  product_details: details[];
}

export interface images {
  id: number;
  name: string;
  productId: number;
}

export interface details {
  id: number;
  name: string;
  value: string;
  productId: number;
}
