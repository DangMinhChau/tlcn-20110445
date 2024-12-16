import axios from "axios";
import { APP_BASE_URL } from "./../configs/constants";

// Lấy toàn reviews thì chỉ admin thôi, vì reviews theo sản phẩm là tự theo bên api call product

export const getAllReviews = async (token, productId) => {
  const res = await axios.get(
    `${APP_BASE_URL}/api/v1/products/${productId}/reviews`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const createReview = async (token, productId, data) => {
  const res = await axios.post(
    `${APP_BASE_URL}/api/v1/products/${productId}/reviews`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// admin only
export const approveReview = async (token, productId, reviewId, isApproved) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/products/${productId}/reviews/${reviewId}`,
    {
      isApproved: isApproved,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
