import React, { useEffect, useState, useContext } from "react";
import LayoutComponent from "../../layout/Layout";
import { useParams } from "react-router-dom";
import {
  Col,
  Image,
  Row,
  Badge,
  Select,
  Button,
  Spin,
  notification,
} from "antd";
import {
  getAllProductsByNameAndparentCategory,
  getProductById,
} from "../../api/productAPI";
import CartCtx from "../../store/cart/CartCtx";
import ProductReviews from "./ProductReviews";

const ProductDetail = () => {
  const { productId } = useParams();
  // Dùng để set hình sản phẩm
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [checking, setChecking] = useState(false);
  const cartCtx = useContext(CartCtx);
  const [currentProduct, setCurrentProduct] = useState({
    discount: 0,
    description: "",
    price: 0,
    images: ["", "", "", ""],
    inventory: [
      {
        size: 0,
        stock: 0,
      },
    ],
    reviews: [],
  });
  const [currentSize, setCurrentSize] = useState({
    size: 0,
    stock: 0,
  });
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  // console.log(currentProduct)
  useEffect(() => {
    getProductById(productId)
      .then((res) => {
        // console.log(res.data.data)
        setCurrentProduct(res.data.data);
        setLoading(false);
        getAllProductsByNameAndparentCategory(
          res.data.data.name,
          res.data.data.parentCategory
        )
          .then((res) => {
            // console.log(res.data.data)
            setProducts(res.data.data);
          })
          .catch((err) => console.log(err));
        let i = 0;
        while (i < res.data.data.inventory.length) {
          if (res.data.data.inventory[i].stock > 0) {
            setCurrentSize(res.data.data.inventory[i]);
            i = res.data.data.inventory.length;
          }
          i++;
        }

        window.scrollTo(0, 0);
      })
      .catch((err) => console.log(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (value) => {
    setQuantity(value);
  };
  const addToCartHandler = async (currentProduct, size, quantity) => {
    setChecking(true);
    const existItem = cartCtx.cartItems.find(
      (item) => item.productId === currentProduct._id && item.size === size
    );
    const newQuantity = existItem ? existItem.quantity + quantity : 1;
    getProductById(currentProduct._id)
      .then((res) => {
        const product = res.data.data;
        const { stock: stockOfSize } = product.inventory.find(
          (item) => item.size === size
        );

        if (stockOfSize < newQuantity) {
          openNotificationWithIcon(
            "error",
            "Sản phẩm hết hàng",
            "Vui lòng loại bỏ khỏi giỏ hàng"
          );
          return;
        }
        setChecking(false);

        cartCtx.addToCart({
          size,
          quantity: newQuantity,
          productId: currentProduct._id,
          price: currentProduct.price,
          coverImage: currentProduct.coverImage,
          productName: currentProduct.name,
          discount: currentProduct.discount,
          parentCategory: currentProduct.parentCategory,
          sku: currentProduct.sku,
          color: currentProduct.color,
          isShow: currentProduct.isShow,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const quantityArray = [];
  for (let i = 1; i <= 20 && i <= currentSize.stock; i++) quantityArray.push(i);

  return (
    <LayoutComponent>
      {contextHolder}
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row className="">
            {/* nửa hình bên trái */}
            <Col span={12}>
              <div className="flex justify-end w-full">
                {currentProduct.discount > 0 ? (
                  <Badge.Ribbon
                    color="red"
                    placement="start"
                    text={`-${currentProduct.discount}%`}
                  >
                    <Image
                      src={currentProduct.coverImage}
                      width={600}
                      alt="Ảnh cover sản phẩm"
                    />
                  </Badge.Ribbon>
                ) : (
                  <Image
                    src={currentProduct.coverImage}
                    width={600}
                    alt="Ảnh cover sản phẩm"
                  />
                )}
              </div>
              <div className="flex justify-end w-full gap-1 mb-1">
                <Image
                  src={currentProduct.images[0]}
                  width={298}
                  // alt="Ảnh cover sản phẩm"
                />

                <Image
                  src={currentProduct.images[1]}
                  width={298}
                  // alt="Ảnh cover sản phẩm"
                />
              </div>

              <div className="flex justify-end w-full gap-1">
                <Image
                  src={currentProduct.images[2]}
                  width={298}
                  // alt="Ảnh cover sản phẩm"
                />

                <Image
                  src={currentProduct.images[3]}
                  width={298}
                  // alt="Ảnh cover sản phẩm"
                />
              </div>
            </Col>

            {/* nửa thong tin bên phải */}
            <Col span={12}>
              <div className="flex flex-col items-start justify-start w-full gap-1 ml-7 mb-7">
                <h2 className="text-left text-[32px] max-w-1/2 my-[10px]">{`${currentProduct.name} ${currentProduct.sku} (${currentProduct.color})`}</h2>
                <div className="flex space-x-2 text-[24px]">
                  <p
                    className={`${
                      currentProduct.discount === 0 ? "" : "line-through"
                    }`}
                  >
                    {currentProduct.price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  {currentProduct.discount !== 0 ? (
                    <p className="text-[#f50]">
                      {Math.round(
                        ((currentProduct.price *
                          (1 - currentProduct.discount / 100)) /
                          1000) *
                          1000
                      ).toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start w-full gap-1 ml-7 text-[20px]">
                {!currentProduct.isShow ? (
                  <p className="text-[#f50] font-bold">
                    Sản phẩm đã dừng kinh doanh
                  </p>
                ) : (
                  <p>
                    Tình trạng:{" "}
                    {currentSize.stock === 0 ? (
                      <span className="text-[#f50] font-bold">Hết hàng</span>
                    ) : (
                      <span className="text-[#0077b6] font-bold">
                        Còn hàng ({currentSize.stock})
                      </span>
                    )}
                  </p>
                )}

                <div className="flex space-x-3 mb-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="w-fit hover:cursor-pointer"
                      onClick={() => {
                        if (checking) return;
                        setCurrentProduct(product);
                        setQuantity(1);
                        let i = 0;
                        while (i < product.inventory.length) {
                          if (product.inventory[i].stock > 0) {
                            setCurrentSize(product.inventory[i]);
                            i = product.inventory.length;
                          }
                          i++;
                        }
                        if (i === product.inventory.length)
                          setCurrentSize({ size: 0, stock: 0 });
                      }}
                    >
                      <Image
                        width={100}
                        src={product.coverImage}
                        preview={false}
                      />
                    </div>
                  ))}
                </div>
                {currentProduct.isShow && (
                  <>
                    <p>Kích thước:</p>
                    <div className="flex max-w-[320px] flex-wrap mb-6">
                      {currentProduct.inventory.map((item) => (
                        <div
                          key={item.size}
                          className={`px-5 py-2 border border-1 border-[#000] ${
                            item.stock === 0
                              ? "hover:cursor-not-allowed bg-[#edf2f4] text-[#d6ccc2]"
                              : " hover:cursor-pointer"
                          } ${
                            item.size === currentSize.size
                              ? "bg-[#000] text-[#fff]"
                              : ""
                          }`}
                          onClick={() => {
                            if (checking) return;
                            if (
                              item.stock === 0 ||
                              item.size === currentSize.size
                            )
                              return;
                            setCurrentSize(item);
                            setQuantity(1);
                          }}
                        >
                          {item.size}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {currentProduct.isShow && (
                <>
                  <div className="flex flex-col items-start justify-start w-full gap-1 ml-7 text-[20px] mb-6">
                    <p>Số lượng:</p>
                    <Select
                      defaultValue={1}
                      style={{
                        width: 120,
                      }}
                      size="large"
                      onChange={handleChange}
                      value={quantity}
                    >
                      {quantityArray.map((i) => (
                        <Select.Option
                          key={i}
                          value={i}
                        >{`${i}`}</Select.Option>
                      ))}
                    </Select>
                  </div>
                </>
              )}

              <div className="flex = justify-start w-full gap-1 ml-7 mb-6">
                <Button
                  className="w-[320px] bg-[#caf0f8] text-[#003049] border border-[#48cae4] font-bold"
                  size="large"
                  onClick={() =>
                    addToCartHandler(currentProduct, currentSize.size, quantity)
                  }
                  disabled={checking || !currentProduct.isShow}
                >
                  {" "}
                  Thêm vào giỏ hàng
                </Button>
              </div>
              <div className="flex flex-col items-start justify-start w-full gap-1 ml-7  mb-6">
                <p className="text-[20px]">Mô tả:</p>
                <div className="max-w-[350px] text-left">
                  {currentProduct.description
                    .split("\\n")
                    .map((text, index) => (
                      <p key={index}>{text}</p>
                    ))}
                </div>
              </div>
            </Col>
          </Row>
          <br className="border border-1 border-[#000]" />
          <ProductReviews productId={currentProduct._id || ""} />
        </>
      )}
    </LayoutComponent>
  );
};

export default ProductDetail;
