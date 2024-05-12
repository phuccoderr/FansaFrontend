/* eslint-disable no-useless-catch */
import { URL_AUTH } from ".";
import instanceAxios from "./jwtService";

const URL_CART = `${URL_AUTH}/cart`;

interface cartProps {
  productId: number;
  quantity: number;
  customerId: number;
}

export const addToCart = async ({
  productId,
  quantity,
  customerId,
}: cartProps) => {
  try {
    const resp = await instanceAxios.post(
      `${URL_CART}/add/${productId}/${quantity}?customerId=${customerId}`,
    );
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};
