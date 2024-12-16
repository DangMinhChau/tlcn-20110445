import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Result, Spin, Button } from "antd";
import { verifyEmail } from "../api/authAPI";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await verifyEmail(token);
      console.log(response);
      if (response.status === "success") {
        setSuccess(() => setSuccess(true));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xác thực thất bại");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (success) {
    return (
      <Result
        status="success"
        title="Xác thực email thành công!"
        subTitle="Bạn có thể đăng nhập ngay bây giờ"
        extra={
          <Link to="/login">
            <span className="text-[#1677ff] hover:text-[#1677ffde]">
              Đăng nhập
            </span>
          </Link>
        }
      />
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Xác thực thất bại"
        subTitle={error}
        extra={
          <Link to="/login">
            <span className="text-[#1677ff] hover:text-[#1677ffde]">
              Đăng nhập
            </span>
          </Link>
        }
      />
    );
  }

  return (
    <Result
      title="Xác thực email"
      subTitle="Nhấn nút bên dưới để xác thực email của bạn"
      extra={
        <Button
          type="primary"
          onClick={handleVerify}
          className="text-[#48cae4] border border-[#48cae4]"
        >
          Xác thực email
        </Button>
      }
    />
  );
};

export default VerifyEmailPage;
