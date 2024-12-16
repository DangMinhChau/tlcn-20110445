import { Descriptions, Image, Table } from "antd";
import React from "react";
const columns = [
  {
    title: "Hình ảnh",
    dataIndex: "coverImage",
    key: "coverImage",
    render: (_, { product }) => (
      <Image width={50} preview={false} src={product.coverImage} />
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
    render: (_, record) => <p>{record.product.name}</p>,
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
            {price.toLocaleString("vi", { style: "currency", currency: "VND" })}
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
];
const ExpendedOrderTable = ({ order }) => {
  console.log(order);
  const total = order.orderItems
    ? order.orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) +
      order.shippingPrice -
      (order.voucher ? order.voucher.discount : 0)
    : 0;
  return (
    <div className="flex space-y-5 flex-col">
      <Descriptions
        title={<h2 className="text-left text-[24px]">Chi tiết đơn hàng</h2>}
        column={1}
        labelStyle={{ fontSize: "16px", fontWeight: "bold" }}
        contentStyle={{ fontSize: "16px", fontWeight: "500" }}
      >
        <Descriptions.Item label="Mã đơn hàng">
          {order._id ? order._id : 0}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao">{`${order.address.phoneNo}| ${order.address.fullName}, ${order.address.address}, ${order.address.ward}, ${order.address.district}, ${order.address.city} `}</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {order._id
            ? total.toLocaleString("vi", { style: "currency", currency: "VND" })
            : 0}
        </Descriptions.Item>
      </Descriptions>
      <div>
        <h3 className="text-[16px] font-bold mb-3">Danh sách sản phẩm </h3>
        <Table
          columns={columns}
          bordered
          dataSource={order.orderItems}
          size="small"
          pagination={false}
        />
      </div>
      <div className=" flex flex-col items-end space-y-3">
        <p className="text-[16px]">
          Thành tiền:{" "}
          <span className="font-bold">
            {order.orderItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString("vi", { style: "currency", currency: "VND" })}
          </span>
        </p>
        <p className="text-[16px]">
          Phí vận chuyển:{" "}
          <span className="font-bold">
            {order.shippingPrice.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </p>
        <p className="text-[16px]">
          Giảm giá voucher:{" "}
          <span className="font-bold">
            {(order.voucher ? order.voucher.discount : 0).toLocaleString("vi", {
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
              (order.voucher ? order.voucher.discount : 0)
            ).toLocaleString("vi", { style: "currency", currency: "VND" })}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ExpendedOrderTable;
