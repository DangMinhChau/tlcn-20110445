import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authAPI";
const success = (mes) => {
  Modal.success({
    title: "SUCCESS",
    content: mes,
    closable: true,
  });
};
const error = (mes) => {
  Modal.error({
    title: "ERROR",
    content: mes,
    closable: true,
  });
};
const ForgotPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    forgotPassword(values)
      .then((res) => {
        setLoading(false);
        success("Đã gửi mail đường dẫn đổi mật khẩu");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      })
      .catch((err) => {
        setLoading(false);
        error(err.response.data.message);
      });
  };
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="w-1/4 bg-white p-5 rounded-[8px]">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: false,
          }}
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "Vui lòng thêm email hợp lệ",
              },
              {
                required: true,
                message: "Vui lòng thêm email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="text-[#48cae4] border border-[#48cae4]"
            >
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
};

export default ForgotPage;
