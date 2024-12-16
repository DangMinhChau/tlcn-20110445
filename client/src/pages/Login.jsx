import React, { useContext, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authAPI";
import AuthContext from "../store/authCtx";

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

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  // Handle location state for redirection after login
  const { state } = useLocation();
  let navigatePage = "/"; // Default page to navigate after login
  if (state && state.previousPage) {
    navigatePage = state.previousPage;
  }

  // Handle form submission
  const onFinish = (values) => {
    setLoading(true);
    loginUser(values)
      .then((res) => {
        setLoading(false);
        const { token, data } = res;
        const user = data.user;

        // Store user data in context
        authCtx.login(
          token,
          user.firstName,
          user.lastName,
          user.photo,
          user.email,
          user.role
        );

        success("Đăng nhập thành công");

        setTimeout(() => {
          Modal.destroyAll(); // Close any open modals
          if (user.role === "admin") {
            navigate("/admin"); // Redirect to admin page if admin
          } else {
            navigate(navigatePage); // Redirect to previous page or home
          }
        }, 1000);
      })
      .catch((err) => {
        setLoading(false);
        const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra";
        error(errorMessage); // Display error message from backend or generic error
      });
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <div className="w-96 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đăng nhập
        </h2>
        <Form
          name="login"
          className="login-form"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ",
              },
              {
                required: true,
                message: "Vui lòng nhập email",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Link
              className="text-blue-500 hover:text-blue-600"
              to="/forgotPassword"
            >
              Quên mật khẩu?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-10 bg-blue-600 hover:bg-[#00b4d8] font-medium rounded-md text-white"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link className="text-blue-500 hover:text-blue-600" to="/signup">
              Đăng ký ngay
            </Link>
          </div>
        </Form>
      </div>
    </main>
  );
};

export default Login;

// import React, { useContext, useState } from "react";
// import { LockOutlined, UserOutlined } from "@ant-design/icons";
// import { Button, Form, Input, Modal } from "antd";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { loginUser } from "../api/authAPI";
// import AuthContext from "../store/authCtx";
// const success = (mes) => {
//   Modal.success({
//     title: "SUCCESS",
//     content: mes,
//     closable: true,
//   });
// };
// const error = (mes) => {
//   Modal.error({
//     title: "ERROR",
//     content: mes,
//     closable: true,
//   });
// };
// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const authCtx = useContext(AuthContext);

//   const { state } = useLocation();
//   let navigatePage = "/";
//   if (state) {
//     if (Object.hasOwn(state, "previousPage")) navigatePage = state.previousPage;
//   }

//   const onFinish = (values) => {
//     setLoading(true);
//     loginUser(values)
//       .then((res) => {
//         setLoading(false);
//         authCtx.login(
//           res.token,
//           res.data.user.firstName,
//           res.data.user.lastName,
//           res.data.user.photo,
//           res.data.user.email,
//           res.data.user.role,
//           res.user._id
//         );
//         success("Đăng nhập thành công");
//         setTimeout(() => {
//           Modal.destroyAll();
//           if (res.data.user.role === "admin") {
//             navigate("/admin");
//           } else {
//             navigate(navigatePage);
//           }
//         }, 1000);
//       })
//       .catch((err) => {
//         setLoading(false);
//         error(err.response.data.message);
//       });
//   };
//   return (
//     <main className="w-screen h-screen flex justify-center items-center">
//       <div className="w-1/4 bg-white p-5 rounded-[8px]">
//         <Form
//           name="normal_login"
//           className="login-form"
//           initialValues={{
//             remember: false,
//           }}
//           onFinish={onFinish}
//           disabled={loading}
//         >
//           <Form.Item
//             name="email"
//             rules={[
//               {
//                 type: "email",
//                 message: "Vui lòng thêm email hợp lệ",
//               },
//               {
//                 required: true,
//                 message: "Vui lòng thêm email!",
//               },
//             ]}
//           >
//             <Input
//               prefix={<UserOutlined className="site-form-item-icon" />}
//               placeholder="Email"
//             />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             hasFeedback
//             rules={[
//               {
//                 required: true,
//                 message: "Vui lòng thêm mật khẩu",
//               },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || value.length >= 8) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(
//                     new Error("Mật khẩu phải từ 8 ký tự trở lên")
//                   );
//                 },
//               }),
//             ]}
//           >
//             <Input.Password
//               prefix={<LockOutlined className="site-form-item-icon" />}
//               placeholder="Mật khẩu"
//             />
//           </Form.Item>
//           <Form.Item>
//             <Link className="login-form-forgot" to={"/forgotPassword"}>
//               <span className="text-[#1677ff] hover:text-[#1677ffde]">
//                 Forgot password
//               </span>
//             </Link>
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="text-[#48cae4] border border-[#48cae4]"
//             >
//               Đăng nhập
//             </Button>
//             Chưa có tài khoản?{" "}
//             <Link to={"/signup"}>
//               <span className="text-[#1677ff] hover:text-[#1677ffde]">
//                 {" "}
//                 Đăng ký ngay
//               </span>
//             </Link>
//           </Form.Item>
//         </Form>
//       </div>
//     </main>
//   );
// };

// export default Login;
