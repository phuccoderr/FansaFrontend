/* eslint-disable no-useless-catch */
import instanceAxios, { BASE_URL_AUTH } from "../accessToken";

const URL_CATEGORIES = `${BASE_URL_AUTH}/categories`;

export const listCategories = async () => {
  try {
    const res = await instanceAxios.get(URL_CATEGORIES);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};

export const getCategory = async (id) => {
  try {
    const res = await instanceAxios.get(`${URL_CATEGORIES}/${id}`);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};

export const createCategory = async ({ data, fileImage }) => {
  var formData = new FormData();
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  formData.append("data", blob);
  formData.append("fileImage", fileImage);

  try {
    const res = await instanceAxios.post(URL_CATEGORIES, formData);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async ({ id, data, fileImage }) => {
  var formData = new FormData();
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  formData.append("data", blob);
  if (fileImage !== "") {
    formData.append("fileImage", fileImage);
  }
  try {
    const res = await instanceAxios.put(`${URL_CATEGORIES}/${id}`, formData);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await instanceAxios.delete(`${URL_CATEGORIES}/${id}`);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};
