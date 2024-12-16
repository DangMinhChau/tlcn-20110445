import axios from "axios";
import { APP_BASE_URL } from "./../configs/constants";

export const getAllVoucherAdmin = async (token) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/vouchers/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getAllVouchers = async () => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/vouchers`);
  return res.data;
};

export const getVoucherById = async (voucherId) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/vouchers/${voucherId}`);
  return res.data;
};

export const createVoucher = async (token, data) => {
  const res = await axios.post(`${APP_BASE_URL}/api/v1/vouchers`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const updateVoucher = async (token, data, voucherId) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/vouchers/${voucherId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
export const deleteVoucher = async (token, voucherId) => {
  const res = await axios.delete(
    `${APP_BASE_URL}/api/v1/vouchers/${voucherId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
