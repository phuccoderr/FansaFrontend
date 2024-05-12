import axios from "axios";
import { URL_AUTH } from ".";
const URL_REFRESHTOKEN = "http://localhost/refreshtoken";

const setAccessToken = (accessToken: string) => {
  localStorage.setItem("access_token", accessToken);
};

const getAccessToken = (): string | null => {
  const token = window.localStorage.getItem("access_token");
  return token;
};

const getLocalRefreshToken = (): string | null => {
  const token = window.localStorage.getItem("refresh_token");
  return String(token);
};

const refreshToken = async () => {
  try {
    const response = await axios.post(URL_REFRESHTOKEN, {
      refreshToken: getLocalRefreshToken(),
    });

    const newAccessToken = response.data.access_token;
    setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const instanceAxios = axios.create({
  baseURL: `${URL_AUTH}`,
});

instanceAxios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});

instanceAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      originalRequest._retry = true; // THỬ LẠI REQUEST
      console.log("Author");
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return instanceAxios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default instanceAxios;
