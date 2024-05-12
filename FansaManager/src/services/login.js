import axios from "axios";

const BASE_URL_LOGIN = "http://localhost:8080/auth/login";

export const loginRequest = async (dataUser) => axios.post(BASE_URL_LOGIN,dataUser);