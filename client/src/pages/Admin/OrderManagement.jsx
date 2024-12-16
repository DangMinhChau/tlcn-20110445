import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/authCtx";
import {
  acceptOrder,
  completeOrder,
  deleteOrder,
  getAllOrdersAdmin,
} from "../../api/orderAPI";
import { Button, Table, Tag, notification } from "antd";
import ExpendedOrderTable from "../Order/ExpendedOrderTable";
import OrderUpdateStatusForm from "../Order/OrderUpdateStatusForm";

const OrderManagement = () => {
  const authCtx = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(true);
  const [order, setOrder] = useState({});
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  useEffect(() => {
    getAllOrdersAdmin(authCtx.token)
      .then((res) => {
        setOrders(
          res.data.data.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 0))
        );
      })
      .catch((err) => {
        console.log(err.response.data);
        openNotificationWithIcon(
          "error",
          "Tải danh sách đơn hàng thất bại",
          err.response.data.message
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, record) => <p>{record.user?.email}</p>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (_, record) => (
        <p>{new Date(record.createdAt).toLocaleString("en-GB")}</p>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filters: [
        {
          text: "COD",
          value: "COD",
        },
        {
          text: "PayPal",
          value: "PayPal",
        },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Tổng cộng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, record) => (
        <p>
          {(
            record.totalPrice +
            record.shippingPrice -
            (record.voucher ? record.voucher.discount : 0)
          ).toLocaleString("vi", { style: "currency", currency: "VND" })}
        </p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record) => (
        <Tag
          color={
            record.orderStatus === "done"
              ? "green"
              : record.orderStatus === "fail"
              ? "red"
              : record.orderStatus === "processing"
              ? "blue"
              : "orange"
          }
        >
          {record.orderStatus === "new"
            ? "Chờ xác nhận"
            : record.orderStatus === "processing"
            ? "Đang xử lý"
            : record.orderStatus === "done"
            ? "Hoàn thành"
            : "Đã hủy"}
        </Tag>
      ),
      filters: [
        {
          text: "Chờ xác nhận",
          value: "new",
        },
        {
          text: "Đang xử lý",
          value: "processing",
        },
        {
          text: "Hoàn thành",
          value: "done",
        },
        {
          text: "Đã hủy",
          value: "fail",
        },
      ],
      onFilter: (value, record) => record.orderStatus === value,
    },
    {
      title: "Cập nhật trạng thái",
      key: "updateStatus",
      render: (_, record) => (
        <Button
          onClick={() => {
            setOpen(true);
            setOrder(record);
          }}
        >
          Cập nhật
        </Button>
      ),
    },
  ];
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    console.log("order: ", order._id);
    if (!values.orderStatus || values.orderStatus === order.orderStatus) {
      setOpen(false);
      return;
    }
    if (values.orderStatus === "processing") {
      acceptOrder(authCtx.token, order._id)
        .then((res) => {
          openNotificationWithIcon(
            "success",
            "Chấp nhận đơn hàng thành công",
            ""
          );
          setReload((old) => !old);
          setOpen(false);
        })
        .catch((err) => {
          console.log(err.response.data);
          setOpen(false);
          openNotificationWithIcon(
            "error",
            "Chấp nhận đơn hàng thất bại",
            err.response.data.message
          );
        });
    } else if (values.orderStatus === "done") {
      completeOrder(authCtx.token, order._id)
        .then((res) => {
          openNotificationWithIcon(
            "success",
            "Hoàn thành đơn hàng thành công",
            ""
          );

          setOpen(false);
          setReload((old) => !old);
        })
        .catch((err) => {
          console.log(err.response.data);
          setOpen(false);
          openNotificationWithIcon(
            "error",
            "Hoàn thành đơn hàng thất bại",
            err.response.data.message
          );
        });
    } else {
      deleteOrder(authCtx.token, order._id)
        .then((res) => {
          openNotificationWithIcon("success", "Hủy đơn hàng thành công", "");

          setOpen(false);
          setReload((old) => !old);
        })
        .catch((err) => {
          console.log(err.response.data);
          setOpen(false);
          openNotificationWithIcon(
            "error",
            "Hủy đơn hàng thất bại",
            err.response.data.message
          );
        });
    }
  };
  return (
    <section>
      {contextHolder}
      <OrderUpdateStatusForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
        order={order}
      />
      <h2 className="text-[24px] my-6 font-bold">Danh sách đơn hàng</h2>
      <Table
        columns={columns}
        dataSource={orders}
        bordered
        rowKey={(record) => record._id}
        expandable={{
          expandedRowRender: (record) => <ExpendedOrderTable order={record} />,
        }}
      />
    </section>
  );
};

export default OrderManagement;
