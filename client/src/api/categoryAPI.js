import axios from "axios";
import { APP_BASE_URL } from "./../configs/constants";

// categoryAPI.js
export const getAllCategories = async () => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/categories`);
  return res.data;
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  const res = await axios.get(
    `${APP_BASE_URL}/api/v1/categories/${categoryId}`
  );
  return res.data;
};

// Create a new category
export const createCategory = async (token, data) => {
  console.log(token);
  const res = await axios.post(`${APP_BASE_URL}/api/v1/categories`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update an existing category
// client/src/api/categoryAPI.js
export const updateCategory = async (token, data, categoryId) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/categories/${categoryId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const deleteCategory = async (token, categoryId) => {
  const res = await axios.delete(
    `${APP_BASE_URL}/api/v1/categories/${categoryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
