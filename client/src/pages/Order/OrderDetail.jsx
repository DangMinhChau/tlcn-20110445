import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LayoutComponent from "../../layout/Layout";
import { getOrderById } from "../../api/orderAPI";
import AuthContext from "../../store/authCtx";
import {
  Button,
  Card,
  Descriptions,
  Image,
  Spin,
  Table,
  Tag,
  notification,
} from "antd";
import AccountNav from "../User/AccountNav";
import ReviewForm from "./ReviewForm";
import { createReview } from "../../api/reviewAPI";

const OrderDetail = () => {
  const authCtx = useContext(AuthContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState({
    orderItems: [],
    shippingPrice: 0,
    voucher: { discount: 0 },
  });

  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  useEffect(() => {
    getOrderById(authCtx.token, orderId)
      .then((res) => {
        setOrder(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response.data.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tagColor =
    order.orderStatus === "done"
      ? "green"
      : order.orderStatus === "fail"
      ? "red"
      : order.orderStatus === "processing"
      ? "blue"
      : "orange";
  const tagContent =
    order.orderStatus === "done"
      ? "Hoàn tất"
      : order.orderStatus === "fail"
      ? "Đã hủy"
      : order.orderStatus === "processing"
      ? "Đang xử lý"
      : "Chờ xác nhận";

  const total = order?.orderItems
    ? order.orderItems.reduce(
        (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
        0
      ) +
      (order?.shippingPrice || 0) -
      (order?.voucher?.discount || 0)
    : 0;

  let paymentMethod = "";
  if (order.paymentMethod) {
    if (order.paymentMethod === "COD") {
      paymentMethod = "Thanh toán bằng tiền mặt khi nhận hàng";
    } else {
      paymentMethod = "Thanh toán bằng Paypal";
    }
  }
  // Hình, tên sản phẩm, customId, size,màu,  price+ discount sl tổng
  const orderItemsData = [];
  order.orderItems &&
    order.orderItems.forEach((orderItem) => {
      orderItemsData.push({
        product: orderItem.product,
        price: orderItem.price,
        size: orderItem.size,
        quantity: orderItem.quantity,
      });
    });
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (_, { product }) => (
        <Image width={100} preview={false} src={product.coverImage} />
      ),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "_id",
      key: "_id",
      render: (_, { product }) => <p>{product.sku}</p>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, { product }) => (
        <Link to={`/product/${product._id}`}>{product.name}</Link>
      ),
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      render: (_, { size }) => <p className="text-center">{size}</p>,
    },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
      render: (_, { product }) => <p>{product.color}</p>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, { product, price }) => (
        <div>
          {product.price > price ? (
            <>
              <p>
                {price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <p className="line-through text-slate-300">
                {product.price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </>
          ) : (
            <p>
              {price.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, { quantity }) => <p className="text-center">{quantity}</p>,
    },
    {
      title: "Thành tiền",
      dataIndex: "itemTotal",
      key: "itemTotal",
      render: (_, { price, quantity }) => (
        <p className="text-center">
          {(price * quantity).toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      ),
    },
    {
      title: "",
      dataIndex: "review",
      key: "review",
      render: (_, { product }) => (
        <Button
          disabled={!(order.orderStatus === "done")}
          onClick={() => {
            setOpen(true);
            setProductId(product._id);
          }}
        >
          Nhận xét
        </Button>
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const onCreate = (values, productId) => {
    if (!values.comment) values.comment = "";
    createReview(authCtx.token, productId, values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Đã đánh giá thành công,",
          "Đánh giá của bạn sẽ được xét duyệt trước khi hiển thị"
        );
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Đánh giá thất bại",
          err.response.data.message
        );
      });
    setOpen(false);
  };
  return (
    <LayoutComponent>
      {contextHolder}
      <ReviewForm
        open={open}
        onCreate={onCreate}
        productId={productId}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <main className="flex justify-center space-x-8">
        <AccountNav
          userInfo={{
            firstName: authCtx.firstName,
            lastName: authCtx.lastName,
            photo: authCtx.photo,
            role: authCtx.role,
            email: authCtx.email,
          }}
        />
        <section className="w-[900px] ">
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <div className="mb-6 flex bg-slate-100 px-4 py-5">
                <Descriptions
                  title={
                    <h2 className="text-left text-[24px]">Chi tiết đơn hàng</h2>
                  }
                  column={1}
                  labelStyle={{ fontSize: "16px", fontWeight: "bold" }}
                  contentStyle={{ fontSize: "16px", fontWeight: "500" }}
                >
                  <Descriptions.Item>
                    <Tag color={tagColor}>{tagContent}</Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Mã đơn hàng">
                    {order._id ? order._id : 0}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày mua">
                    {order._id
                      ? new Date(order.createdAt).toLocaleString("en-GB", {
                          timeZone: "UTC",
                        })
                      : 0}
                  </Descriptions.Item>

                  <Descriptions.Item label="Tổng tiền">
                    {order._id
                      ? total.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })
                      : 0}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div className="mb-6 flex bg-slate-100 px-4 py-5">
                <div className="flex justify-center w-full space-x-10">
                  <Card title="Thông tin người nhận" style={{ width: 300 }}>
                    <p className="text-left">
                      {order.address ? order.address.fullName : ""}
                    </p>
                    <p className="text-left">
                      {order.address ? order.address.address : ""}
                    </p>
                    <p className="text-left">
                      {order.address ? order.address.ward : ""},{" "}
                      {order.address ? order.address.district : ""},{" "}
                      {order.address ? order.address.city : ""}
                    </p>
                    <p className="text-left">
                      SĐT:{order.address ? order.address.phoneNo : ""}
                    </p>
                  </Card>
                  <Card title="Phương thức thanh toán">
                    <p className="text-left">{paymentMethod}</p>
                  </Card>
                </div>
              </div>
              <div className="mb-6 flex bg-slate-100 px-4 py-5">
                <Table
                  columns={columns}
                  dataSource={orderItemsData}
                  pagination={false}
                />
              </div>
              <div className=" flex flex-col items-end space-y-3">
                <p className="text-[16px]">
                  Thành tiền:{" "}
                  <span className="font-bold">
                    {order.orderItems
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </span>
                </p>
                <p className="text-[16px]">
                  Phí vận chuyển:{" "}
                  <span className="font-bold">
                    {(order.shippingPrice || 0).toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>
                <p className="text-[16px]">
                  Giảm giá voucher:{" "}
                  <span className="font-bold">
                    {(order?.voucher?.discount || 0).toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>

                <p className="text-[16px]">
                  Tổng số tiền:{" "}
                  <span className="font-bold">
                    {(
                      order.orderItems.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      ) +
                      order.shippingPrice -
                      (order?.voucher ? order?.voucher?.discount : 0)
                    ).toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>
              </div>
            </>
          )}
        </section>
      </main>
    </LayoutComponent>
  );
};

export default OrderDetail;
