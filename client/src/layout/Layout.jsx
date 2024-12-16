import React from "react";
import "../index.css";
import { Layout, theme } from "antd";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
const { Content } = Layout;
const LayoutComponent = (props) => {
  // const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="layout min-h-screen">
      <HeaderComponent />
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <div
          className="site-layout-content mx-0"
          style={{
            background: colorBgContainer,
          }}
        >
          {props.children}
        </div>
      </Content>
      <FooterComponent />
    </Layout>
  );
};
export default LayoutComponent;
