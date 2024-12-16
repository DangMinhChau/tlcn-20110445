import React, { useState, useEffect } from "react";
import LayoutComponent from "../../layout/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllProductsByDiscount,
  getAllProductsByparentCategory,
} from "../../api/productAPI";
import ProductItem from "./ProductItem";
import { Pagination, Popover, Select, Slider, Spin } from "antd";
import { pageSize } from "../../configs/constants";
import { getAllCategories } from "../../api/categoryAPI";

const formatter = (value) =>
  value.toLocaleString("vi", { style: "currency", currency: "VND" });
const ProductCollection = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createAt");
  const [filterCategory, setFilterCategory] = useState("all");
  const [rangePrice, setRangePrice] = useState([0, 2000000]);
  const [totalItems, setTotalItems] = useState(0);
  const [current, setCurrent] = useState(1);
  const type = searchParams.get("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (category.length === 0) {
      // console.log("category.length===0")
      getAllCategories()
        .then((res) => {
          setCategory(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLoading(true);
    if (!type) navigate("/product");
    if (!(type === "discount" || type === "pants" || type === "shirts"))
      navigate("/product");
    if (type === "pants" || type === "shirts") {
      getAllProductsByparentCategory(
        type,
        pageSize,
        current,
        filterCategory,
        sortBy,
        rangePrice
      )
        .then((res) => {
          setProducts(res.data.data);
          setTotalItems(res.totalPage * pageSize);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } else {
      getAllProductsByDiscount(
        pageSize,
        current,
        filterCategory,
        sortBy,
        rangePrice
      )
        .then((res) => {
          setProducts(res.data.data);
          setTotalItems(res.totalPage * pageSize);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, filterCategory, sortBy, rangePrice[0], rangePrice[1], type]);
  useEffect(() => {
    setFilterCategory("all");
    setSortBy("createAt");
    setTotalItems(0);
    setCurrent(1);
    setRangePrice([0, 2000000]);
  }, [setSearchParams]);

  const categoryOpt = [{ value: "all", label: "Tất cả" }];
  for (let i = 0; i < category.length; i++) {
    categoryOpt.push({ value: category[i]._id, label: category[i].name });
  }
  const onSelectChangeHandler = (value) => {
    // console.log("value recieved from select: ", value);
    if (!value) {
      return;
    } else if (value === "all") {
      setCurrent(1);
      setFilterCategory("all");
    } else {
      setCurrent(1);
      setFilterCategory(value);
    }
  };
  const onAfterChange = (value) => {
    setRangePrice(value);
  };
  const content = (
    <div>
      <p
        className="hover:cursor-pointer hover:text-[#48cae4]"
        onClick={() => setSortBy("price")}
      >
        Giá tăng dần
      </p>
      <p
        className="hover:cursor-pointer hover:text-[#48cae4]"
        onClick={() => setSortBy("-price")}
      >
        Giá giảm dần
      </p>

      <p
        className="hover:cursor-pointer hover:text-[#48cae4]"
        onClick={() => setSortBy("name")}
      >
        Tên: A-Z
      </p>
      <p
        className="hover:cursor-pointer hover:text-[#48cae4]"
        onClick={() => setSortBy("-name")}
      >
        Tên: Z-A
      </p>

      <p
        className="hover:cursor-pointer hover:text-[#48cae4]"
        onClick={() => setSortBy("createAt")}
      >
        Cũ nhất
      </p>
      <p
        className="hover:cursor-pointer hover:text-[#48cae4]"
        onClick={() => setSortBy("-createAt")}
      >
        Mới nhất
      </p>
    </div>
  );
  return (
    <LayoutComponent>
      <>
        <h2 className="text-[32px] font-bold my-3 uppercase">
          {type === "discount"
            ? "Sản phẩm giá sốc"
            : type === "pants"
            ? "Sản phẩm quần"
            : "Sản phẩm áo"}
        </h2>
        <div className="h-10  mx-[74px] flex justify-between">
          <div className="flex">
            <div className="min-w-[400px]">
              <p className="font-bold">
                Giá từ:{" "}
                {rangePrice[0].toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                -{" "}
                {rangePrice[1].toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <Slider
                range
                defaultValue={[0, 2000000]}
                max={2000000}
                step={25000}
                tooltip={{ formatter }}
                onAfterChange={onAfterChange}
              />
            </div>
            <div className="w-[400px]">
              <Select
                placeholder="Loại sản phẩm"
                allowClear
                options={categoryOpt}
                onChange={onSelectChangeHandler}
                size="large"
              />
            </div>
          </div>
          <div>
            <Popover
              content={content}
              title=""
              trigger="hover"
              placement="bottomRight"
            >
              <div className="px-3 py-2 border flex w-[170px] justify-between hover:cursor-pointer">
                <p>Sắp xếp theo</p>
              </div>
            </Popover>
          </div>
        </div>
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <div className="flex flex-wrap justify-center max-w-[100%] gap-4 gap-y-10 my-10">
              {products.length !== 0 ? (
                products
                  .filter(
                    (product) =>
                      Math.round(
                        ((product.price * (1 - product.discount / 100)) /
                          1000) *
                          1000
                      ) >= rangePrice[0] &&
                      Math.round(
                        ((product.price * (1 - product.discount / 100)) /
                          1000) *
                          1000
                      ) <= rangePrice[1]
                  )
                  .map((product) => (
                    <ProductItem product={product} key={product._id} />
                  ))
              ) : (
                <p>Không có sản phẩm</p>
              )}
            </div>
            {products.length !== 0 && (
              <Pagination
                defaultCurrent={current}
                total={totalItems}
                pageSize={pageSize}
                defaultPageSize={pageSize}
                onChange={(page, pageSize) => {
                  setCurrent(page);
                }}
              />
            )}
          </>
        )}
      </>
    </LayoutComponent>
  );
};

export default ProductCollection;
