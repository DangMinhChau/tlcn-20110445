import axios from "axios";
import { APP_BASE_URL } from "./../configs/constants";

export const registerUser = async (data) => {
  const res = await axios.post(`${APP_BASE_URL}/api/v1/users/signup`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${APP_BASE_URL}/api/v1/users/login`, data);
  return res.data;
};

export const logoutUser = async (data) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/users/login`, data);
  return res.data;
};

export const isLoggedIn = async (token) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/users/me-test`, {
    headers: { Authorization: `${token}` },
  });
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await axios.post(
    `${APP_BASE_URL}/api/v1/users/forgot-password`,
    data
  );
  return res.data;
};

export const resetPassword = async (resetToken, data) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/users/reset-password/${resetToken}`,
    data
  );
  return res.data;
};

export const updatePassword = async (token, data) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/users/change-password`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
export const verifyEmail = async (token) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/users/verify/${token}`);
  return res.data;
};
