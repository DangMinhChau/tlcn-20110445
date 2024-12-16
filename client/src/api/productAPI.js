import axios from "axios";
import { APP_BASE_URL } from "./../configs/constants";

// export const getAllProducts = async (
//   limit,
//   page,
//   category,
//   sort,
//   rangePrice
// ) => {
//   const res = await axios.get(
//     // `${APP_BASE_URL}/api/v1/products?fields=name,price,discount,coverImage,color,parentCategory`
//     `${APP_BASE_URL}/api/v1/products?limit=${limit || 1000}&page=${
//       page || 1
//     }&sort=${sort || "createAt"}${
//       category && category !== "all" ? `&category=${category}` : ""
//     }&price[gte]=${rangePrice[0] || 0}&price[lte]=${rangePrice[1] || 2000000}`
//   );
//   return res.data;
// };
export const getAllProducts = async (
  limit,
  page,
  category,
  sort,
  rangePrice,
  search
) => {
  const searchParams = new URLSearchParams();

  // Add basic params
  searchParams.append("limit", limit || 10);
  searchParams.append("page", page || 1);
  searchParams.append("sort", sort || "createAt");

  // Add category filter
  if (category && category !== "all") {
    searchParams.append("category", category);
  }

  // Add price range
  searchParams.append("price[gte]", rangePrice[0] || 0);
  searchParams.append("price[lte]", rangePrice[1] || 2000000);

  // Add search parameters
  if (search) {
    if (search.name) searchParams.append("name", search.name);
    if (search.sku) searchParams.append("sku", search.sku);
    if (search.color) searchParams.append("color", search.color);
  }

  const res = await axios.get(
    `${APP_BASE_URL}/api/v1/products?${searchParams.toString()}`
  );
  return res.data;
};

export const getAllProductsByparentCategory = async (
  parentCategory,
  limit,
  page,
  category,
  sort,
  rangePrice
) => {
  const res = await axios.get(
    `${APP_BASE_URL}/api/v1/products?parentCategory=${parentCategory}&limit=${
      limit || 10000
    }&page=${page || 1}&sort=${sort || "createAt"}${
      category && category !== "all" ? `&category=${category}` : ""
    }${
      rangePrice &&
      `&price[gte]=${rangePrice[0] || 0}&price[lte]=${rangePrice[1] || 2000000}`
    }`
  );
  return res.data;
};

// api/v1/products?limit=3&sort=-discount
export const getAllProductsByDiscount = async (
  limit,
  page,
  category,
  sort,
  rangePrice
) => {
  const res = await axios.get(
    `${APP_BASE_URL}/api/v1/products?limit=${limit || 10000}&page=${
      page || 1
    }&sort=${sort}${
      category && category !== "all" ? `&category=${category}` : ""
    }${
      rangePrice &&
      `&price[gte]=${rangePrice[0] || 0}&price[lte]=${rangePrice[1] || 2000000}`
    }&discount[gt]=0`
  );
  return res.data;
};

export const createProduct = async (token, data) => {
  const res = await axios.post(`${APP_BASE_URL}/api/v1/products`, data, {
    headers: { Authorization: `Bearer ${token}` },
    "Content-Type": "multipart/form-data",
  });
  return res.data;
};

export const updateProduct = async (token, productId, data) => {
  const res = await axios.patch(
    `${APP_BASE_URL}/api/v1/products/${productId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
      "Content-Type": "multipart/form-data",
    }
  );
  return res.data;
};

export const deleteProduct = async (token, data, productId) => {
  const res = await axios.delete(
    `${APP_BASE_URL}/api/v1/products/${productId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getAllProductsByName = async (
  productName,
  limit,
  page,
  sortBy,
  rangePrice
) => {
  const res = await axios.get(
    `${APP_BASE_URL}/api/v1/products?name=${productName}&limit=${
      limit || 10000
    }&page=${page || 1}&sort=${sortBy || "createAt"}${
      rangePrice &&
      `&price[gte]=${rangePrice[0] || 0}&price[lte]=${rangePrice[1] || 2000000}`
    }`
  );
  return res.data;
};

export const getAllProductsByNameAndparentCategory = async (
  productName,
  parentCategory
) => {
  const res = await axios.get(
    // `${APP_BASE_URL}/api/v1/products?fields=name,price,discount,coverImage,color,parentCategory`
    `${APP_BASE_URL}/api/v1/products?parentCategory=${parentCategory}&name=${productName}`
  );
  return res.data;
};

// {{URL}}api/v1/products/:id
export const getProductById = async (productId) => {
  const res = await axios.get(`${APP_BASE_URL}/api/v1/products/${productId}`);
  return res.data;
};
