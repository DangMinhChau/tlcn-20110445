import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Image, Input, Popover } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import AuthContext from "../store/authCtx";
import CartCtx from "../store/cart/CartCtx";
const { Search } = Input;

const HeaderComponent = (props) => {
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartCtx);
  const navigate = useNavigate();
  const logout = () => {
    authCtx.logout();
    navigate("/");
  };
  let content = "";
  let title = "";
  if (authCtx.isLoggedIn) {
    if (authCtx.role === "admin") {
      title = "Chào admin";
      content = (
        <div>
          <ul className="list-disc ml-[10px]">
            <li>
              <Link to={"/admin"}>Dashboard</Link>{" "}
            </li>

            <li
              className="hover:cursor-pointer hover:text-[#48cae4] "
              onClick={logout}
            >
              Đăng xuất
            </li>
          </ul>
        </div>
      );
    } else {
      title = "Thông tin tài khoản";
      content = (
        <div>
          <p className="font-bold">{`${authCtx.firstName || "A"} ${
            authCtx.lastName || "A"
          }`}</p>
          <br />
          <ul className="list-disc ml-[10px]">
            <li>
              <Link to={"/account"}>Tài khoản của tôi</Link>{" "}
            </li>
            <li>
              <Link to={"/account/address"}>Danh sách địa chỉ</Link>{" "}
            </li>
            <li
              className="hover:cursor-pointer hover:text-[#48cae4]"
              onClick={logout}
            >
              Đăng xuất
            </li>
          </ul>
        </div>
      );
    }
  } else {
    content = (
      <div>
        <p>
          Chưa có tài khoản ?{" "}
          <Link to={"/signup"}>
            <span className=" font-bold hover:text-[#48cae4]">
              Đăng ký ngay
            </span>{" "}
          </Link>
          <br />
          hoặc{" "}
          <Link to={"/login"}>
            {" "}
            <span className=" font-bold hover:text-[#48cae4]">đăng nhập</span>
          </Link>
        </p>
      </div>
    );
  }

  const cartContent = (
    <div className="flex flex-col items-center">
      <div className="max-h-[370px] overflow-y-scroll">
        {cartCtx.cartItems.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex space-x-4 border-b-2 my-4 px-3"
          >
            <Image width={70} preview={false} src={item.coverImage} />
            <div>
              <p className="w-fit">
                {`${item.productName} ${
                  item.parentCategory === "pants"
                    ? "Quần"
                    : item.parentCategory === "shirts"
                    ? "Áo"
                    : ""
                } ${item.sku} (${item.color})`}{" "}
                <span className="text-[#a8dadc] font-medium">/{item.size}</span>
              </p>

              <div className=" flex space-x-2">
                <div className="w-fit bg-[#edf2f4] px-[15px] font-medium">
                  {item.quantity}
                </div>
                <div className="w-fit flex space-x-1">
                  <p
                    className={`${
                      item.discount > 0
                        ? "line-through text-[#d6ccc2]"
                        : "font-medium"
                    }`}
                  >
                    {item.price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                  </p>
                  {item.discount > 0 ? (
                    <p className="no-underline font-medium">
                      {Math.round(
                        ((item.price * (1 - item.discount / 100)) / 1000) * 1000
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
            </div>
          </div>
        ))}
      </div>
      <Button
        className="w-[320px] bg-[#caf0f8] text-[#003049] border border-[#48cae4] font-bold"
        size="large"
        onClick={() => {
          navigate("/cart");
        }}
      >
        {" "}
        Xem chi tiết
      </Button>
    </div>
  );

  return (
    <header className="flex justify-between px-12 py-5 bg-[#133E87] text-white">
      <div>
        <Link to={"/"}>
          <span className="font-extrabold text-2xl tracking-wider hover:text-[#48cae4] transition duration-300 cursor-pointer">
            <span className="text-[#48cae4]">4</span>
            <span className="text-white">MEN</span>
            <span className="text-sm font-normal ml-1 tracking-normal">
              STORE
            </span>
          </span>
        </Link>
      </div>
      <nav className="flex space-x-10 text-[18px]">
        <div className="hover:text-[#48cae4] hover:cursor-pointer">
          <Link to={"/product"}>Sản phẩm</Link>{" "}
        </div>
        <div className="hover:text-[#48cae4] hover:cursor-pointer">
          <Link to={"/collections?type=pants"}>Quần</Link>
        </div>
        <div className="hover:text-[#48cae4] hover:cursor-pointer">
          <Link to={"/collections?type=shirts"}>Áo</Link>
        </div>
        <div className="hover:text-[#48cae4] hover:cursor-pointer">
          <Link to={"/collections?type=discount"}>Giảm giá</Link>
        </div>
      </nav>
      <div className="flex space-x-4">
        <div>
          <Search
            placeholder="Tìm sản phẩm"
            loading={false}
            enterButton
            className="w-[350px]"
            onSearch={(value) => {
              navigate(`/search?name=${value}`);
            }}
          />
        </div>
        <Popover content={content} title={authCtx.isLoggedIn ? title : ""}>
          <div>
            <UserOutlined className="text-white text-[25px] hover:text-[#48cae4] hover:cursor-pointer" />
          </div>
        </Popover>
        <Popover content={cartContent} title="GIỎ HÀNG">
          <Badge
            count={cartCtx.cartItems.reduce(
              (total, item) => total + item.quantity,
              0
            )}
            showZero
            onClick={() => navigate("/cart")}
            className="hover:cursor-pointer"
          >
            <div>
              <ShoppingCartOutlined
                style={{ fontSize: "28px" }}
                className="text-white text-[25px] hover:text-[#48cae4] hover:cursor-pointer"
              />
            </div>
          </Badge>
        </Popover>
        <div></div>
      </div>
    </header>
  );
};

export default HeaderComponent;
