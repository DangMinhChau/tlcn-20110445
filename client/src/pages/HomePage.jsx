import React, { useEffect, useState } from "react";
import LayoutComponent from "../layout/Layout";
import COVER1 from "./../assets/images/cover/cover1.jpeg";
import COVER2 from "./../assets/images/cover/cover2.jpeg";
import COVER3 from "./../assets/images/cover/cover3.jpeg";
import { Carousel, Image } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getAllProductsByDiscount,
  getAllProductsByparentCategory,
} from "../api/productAPI";
import ProductItem from "./Product/ProductItem";
const UserHome = () => {
  const [discountProduct, setDiscountProduct] = useState([]);
  const [pantsProduct, setpantsProduct] = useState([]);
  const [shirtsProduct, setshirtsProduct] = useState([]);

  useEffect(() => {
    getAllProductsByparentCategory("pants", 5)
      .then((res) => {
        setpantsProduct(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getAllProductsByparentCategory("shirts", 5)
      .then((res) => {
        setshirtsProduct(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
    getAllProductsByDiscount(5)
      .then((res) => {
        setDiscountProduct(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }, []);

  return (
    <LayoutComponent>
      <Carousel autoplay>
        <Image preview={false} src={COVER1} />

        <Image preview={false} src={COVER2} />

        <Image preview={false} src={COVER3} />
      </Carousel>
      <div className="w-full min-h-96 my-9 mb-20">
        <h2 className="text-[32px] font-bold my-3">Sản phẩm giá sốc</h2>
        <div className="w-full flex justify-center space-x-10 px-3 mb-5">
          {discountProduct.length > 0 &&
            discountProduct.map((product) => (
              <ProductItem product={product} key={product._id} />
            ))}
        </div>
        <Link
          to={"/collections?type=discount"}
          className="group inline-flex items-center"
        >
          <span className="text-[20px] text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
            Xem thêm
          </span>
          <RightOutlined className="ml-2 text-[16px] transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      <div className="w-full min-h-96 my-9 mb-20">
        <h2 className="text-[32px] font-bold my-3">Sản phẩm quần</h2>
        <div className="w-full flex justify-center space-x-10 px-3 mb-5">
          {pantsProduct.length > 0 &&
            pantsProduct.map((product) => (
              <ProductItem product={product} key={product._id} />
            ))}
        </div>
        <Link
          to={"/collections?type=pants"}
          className="group inline-flex items-center"
        >
          <span className="text-[20px] text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
            Xem thêm
          </span>
          <RightOutlined className="ml-2 text-[16px] transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      <div className="w-full min-h-96 my-9 mb-20">
        <h2 className="text-[32px] font-bold my-3">Sản phẩm áo</h2>
        <div className="w-full flex justify-center space-x-10 px-3 mb-5">
          {shirtsProduct.length > 0 &&
            shirtsProduct.map((product) => (
              <ProductItem product={product} key={product._id} />
            ))}
        </div>
        <Link
          to={"/collections?type=shirts"}
          className="group inline-flex items-center"
        >
          <span className="text-[20px] text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
            Xem thêm
          </span>
          <RightOutlined className="ml-2 text-[16px] transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </LayoutComponent>
  );
};

export default UserHome;
