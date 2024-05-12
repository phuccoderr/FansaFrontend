import instanceAxios, { BASE_URL_AUTH } from "../accessToken";
/* eslint-disable no-useless-catch */
const URL_USERS = `${BASE_URL_AUTH}/users`;

export const listUsers = async () =>
  await instanceAxios
    .get(URL_USERS)
    .then((res) => ({
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    }))
    .catch((error) => {
      throw error;
    });

export const getRoles = async () =>
  await instanceAxios
    .get(`${URL_USERS}/roles`)
    .then((res) => ({
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    }))
    .catch((error) => {
      throw error;
    });

export const createUser = async (dataUser) => {
  try {
    const res = await instanceAxios.post(URL_USERS, dataUser);
    console.log("response - fetch", res);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const res = await instanceAxios.get(`${URL_USERS}/${id}`);
    console.log("response - getUser", res);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};

export const updateUser = async ({ id, data }) => {
  try {
    const res = await instanceAxios.put(`${URL_USERS}/${id}`, data);
    console.log("response - putUser", res);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await instanceAxios.delete(`${URL_USERS}/${id}`);
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    throw error;
  }
};
