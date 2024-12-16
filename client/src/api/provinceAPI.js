import axios from "axios";

export const getAllProvinces = async () => {
  const res = await axios.get(`https://provinces.open-api.vn/api/`);
  return res.data;
};

export const getDistrictsByProvince = async (province_code) => {
  const res = await axios.get(
    `https://provinces.open-api.vn/api/p/${province_code}?depth=2`
  );
  return res.data;
};
export const getWardsByDistrict = async (district_code) => {
  const res = await axios.get(
    `https://provinces.open-api.vn/api/d/${district_code}?depth=2`
  );
  return res.data;
};
