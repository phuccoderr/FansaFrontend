/* eslint-disable no-useless-catch */
import axios from "axios";
import { URL_BASE } from ".";

const URL_CATEGORIES = `${URL_BASE}/categories`;

export const getCategories = async () => {
  try {
    const resp = await axios.get(URL_CATEGORIES);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};
