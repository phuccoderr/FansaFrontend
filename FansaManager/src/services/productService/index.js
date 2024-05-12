/* eslint-disable no-useless-catch */
import instanceAxios, { BASE_URL_AUTH } from "../accessToken";

const URL_PRODUCTS = `${BASE_URL_AUTH}/products`;

export const listProducts = async () => {
  try {
    const res = await instanceAxios.get(URL_PRODUCTS);
    return {
      status: res?.status,
      statusText: res?.statusText,
      data: res?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await instanceAxios.get(`${URL_PRODUCTS}/${id}`);
    return {
      status: res?.status,
      statusText: res?.statusText,
      data: res?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const createProduct = async ({ data, mainImage, extraImage }) => {
  var formData = new FormData();
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  formData.append("data", blob);
  formData.append("mainImage", mainImage);

  if (extraImage.length > 0) {
    extraImage.forEach((file) => {
      formData.append("extraImage", file);
    });
  }
  try {
    const res = await instanceAxios.post(URL_PRODUCTS, formData);
    return {
      status: res?.status,
      statusText: res?.statusText,
      data: res?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async ({
  data,
  productId,
  mainImage,
  extraImage,
}) => {
  var formData = new FormData();
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  formData.append("data", blob);
  formData.append("mainImage", mainImage);

  if (extraImage.length > 0) {
    extraImage.forEach((file) => {
      formData.append("extraImage", file);
    });
  }
  try {
    const res = await instanceAxios.put(
      `${URL_PRODUCTS}/${productId}`,
      formData
    );
    return {
      status: res?.status,
      statusText: res?.statusText,
      data: res?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await instanceAxios.delete(`${URL_PRODUCTS}/${id}`);
    return {
      status: res?.status,
      statusText: res?.statusText,
      data: res?.data,
    };
  } catch (error) {
    throw error;
  }
};
