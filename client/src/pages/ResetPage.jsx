import React, { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/authAPI";

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

const ResetPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { resetToken } = useParams();

  const onFinish = (values) => {
    setLoading(true);
    resetPassword(resetToken, values)
      .then((res) => {
        setLoading(false);
        success("Đặt lại mật khẩu thành công");
        setTimeout(() => {
          Modal.destroyAll();
          navigate("/login");
        }, 2000);
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
          name="reset_password"
          className="reset-form"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới",
              },
              {
                min: 8,
                message: "Mật khẩu phải từ 8 ký tự trở lên",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="passwordConfirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="text-[#48cae4] border border-[#48cae4] w-full"
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
};

export default ResetPage;
