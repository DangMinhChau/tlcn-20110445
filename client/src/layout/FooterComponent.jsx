import React from "react";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const FooterComponent = () => {
  return (
    <footer className="bg-[#133E87] text-white mt-10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">4MEN STORE</h3>
            <p className="text-sm mb-4">
              Thương hiệu thời trang nam hàng đầu Việt Nam. Cung cấp các sản
              phẩm quần áo chất lượng cao với giá cả hợp lý.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/product" className="hover:text-[#48cae4]">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/collections?type=pants"
                  className="hover:text-[#48cae4]"
                >
                  Quần
                </Link>
              </li>
              <li>
                <Link
                  to="/collections?type=shirts"
                  className="hover:text-[#48cae4]"
                >
                  Áo
                </Link>
              </li>
              <li>
                <Link
                  to="/collections?type=discount"
                  className="hover:text-[#48cae4]"
                >
                  Giảm giá
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</li>
              <li>Điện thoại: 1900 1234</li>
              <li>Email: contact@4men.com</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-[#48cae4]"
              >
                <FacebookOutlined />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-[#48cae4]"
              >
                <InstagramOutlined />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-[#48cae4]"
              >
                <YoutubeOutlined />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p>&copy; 2024 4MEN Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
