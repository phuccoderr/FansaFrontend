import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const BASE_URL_AUTH = "http://localhost:8080/auth";

const instanceAxios = axios.create({ baseURL: `${BASE_URL_AUTH}` });

instanceAxios.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  const currentTime = new Date();
  const decoded = jwtDecode(access_token);

  if (!access_token) {
    window.location.href = "/login";
  }

  if (decoded.exp < currentTime / 1000) {
    window.location.href = "/login";
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  }

  config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

export default instanceAxios;