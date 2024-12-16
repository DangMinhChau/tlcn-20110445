import axios from "axios";
import { APP_BASE_URL } from "./../configs/constants";

export const getOrderStats = async (token) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/orders/order-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getBestSeller = async () => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/products/best-seller/5`);
  return res.data;
};

export const getProductStats = async () => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/products/product-stats`);
  return res.data;
};
