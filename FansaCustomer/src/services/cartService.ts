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

export const getCart = async (customerId: number) => {
  try {
    const resp = await instanceAxios.get(`${URL_CART}/${customerId}`);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteCart = async ({
  productId,
  customerId,
}: {
  productId: number;
  customerId: number;
}) => {
  try {
    const resp = await instanceAxios.delete(
      `${URL_CART}/delete/${productId}?customerId=${customerId}`,
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
