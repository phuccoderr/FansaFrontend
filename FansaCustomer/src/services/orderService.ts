/* eslint-disable no-useless-catch */
import { checkoutInfo } from "@/types/cart";
import { URL_AUTH } from ".";
import instanceAxios from "./jwtService";

const URL_ORDER = `${URL_AUTH}/order`;

export const placeOrder = async ({
  info,
  customerId,
}: {
  info: checkoutInfo;
  customerId: number;
}) => {
  try {
    await instanceAxios.post(`${URL_ORDER}/${customerId}`, info);
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (customerId: number) => {
  try {
    const resp = await instanceAxios.get(`${URL_ORDER}/${customerId}`);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};
