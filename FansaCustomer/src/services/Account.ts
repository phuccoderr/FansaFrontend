/* eslint-disable no-useless-catch */
import { registerRequest, signInRequest } from "@/types/AccountRequest";
import axios from "axios";
import { URL_BASE } from ".";

const URL_SIGNIN = `${URL_BASE}/signin`;
const URL_REGISTER = `${URL_BASE}/register`;
const URL_SIGNIN_GG = `${URL_BASE}/signin/google`;
const URL_SIGNIN_FB = `${URL_BASE}/signin/facebook`;

export const signIn = async (data: signInRequest) => {
  try {
    const resp = await axios.post(URL_SIGNIN, data);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};

export const signInGG = async (accessToken: string) => {
  try {
    const resp = await axios.get(`${URL_SIGNIN_GG}?accessToken=${accessToken}`);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};

export const signInFB = async (accessToken: string) => {
  try {
    const resp = await axios.get(`${URL_SIGNIN_FB}?accessToken=${accessToken}`);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};

export const register = async (data: registerRequest) => {
  try {
    const resp = await axios.post(URL_REGISTER, data);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};
