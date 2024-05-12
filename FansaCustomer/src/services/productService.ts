/* eslint-disable no-useless-catch */
import axios from "axios";
import { URL_BASE } from ".";

const URL_PRODUCTS = `${URL_BASE}/products`;

interface listProduct {
  alias?: string;
  keyword?: string;
  sort_field?: string;
  pageNum: number;
}

export const getProducts = async ({
  alias,
  keyword,
  sort_field,
  pageNum = 1,
}: listProduct) => {
  const paramAlias = alias ? "alias=" + alias : "";
  const paramKeyword = keyword ? "&keyword=" + keyword : "";
  const paramSortField = sort_field ? "&sort_field=" + sort_field : "";
  try {
    const resp = await axios.get(
      `${URL_PRODUCTS}/page/${pageNum}?${paramAlias}${paramSortField}${paramKeyword}`,
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

export const getProduct = async (alias: string | undefined) => {
  try {
    const resp = await axios.get(`${URL_PRODUCTS}/${alias}`);
    return {
      data: resp.data,
      status: resp.status,
      statusText: resp.statusText,
    };
  } catch (error) {
    throw error;
  }
};
