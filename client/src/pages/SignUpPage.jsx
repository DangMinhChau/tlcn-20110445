import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authAPI";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    registerUser(values)
      .then((res) => {
        setLoading(false);
        Modal.success({
          title: "Đăng ký thành công!",
          content: "Vui lòng kiểm tra email để xác thực tài khoản.",
          onOk() {
            navigate("/login");
          },
        });
      })
      .catch((err) => {
        setLoading(false);
        Modal.error({
          title: "Lỗi",
          content: err.response?.data?.message || "Đăng ký thất bại",
        });
      });
  };

  return (
    <main className="w-screen min-h-screen flex justify-center items-center bg-gray-50 py-8">
      <div className="w-[480px] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đăng ký tài khoản
        </h2>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          disabled={loading}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Tên"
                size="large"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Họ"
                size="large"
                className="rounded-md"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="passwordConfirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu xác nhận không khớp!");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-10 bg-blue-600 hover:bg-[#00b4d8] text-white font-medium rounded-md"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link className="text-blue-500 hover:text-blue-600" to="/login">
              Đăng nhập ngay
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
};

export default SignUpPage;
