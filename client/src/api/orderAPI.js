import axios from "axios";
import { APP_BASE_URL } from "./../configs/constants";

export const getAllOrders = async (token) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/orders/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAllOrdersAdmin = async (token) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getOrderById = async (token, orderId) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createOrder = async (token, data) => {
  const res = await axios.post(`${APP_BASE_URL}/api/v1/orders`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const payOrder = async (token, data) => {
  //    data:{ "paymentResult": {
  //     "status": true,
  //     "updateTime": "2023-05-09T12:54:11.420Z"
  // }}
  const res = await axios.post(`${APP_BASE_URL}/api/v1/orders`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const acceptOrder = async (token, orderId) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/orders/${orderId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
export const completeOrder = async (token, orderId) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/orders/admin/${orderId}`,
    {
      doneAt: new Date(Date.now()),
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const deleteOrder = async (token, orderId) => {
  const res = await axios.delete(`${APP_BASE_URL}/api/v1/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
