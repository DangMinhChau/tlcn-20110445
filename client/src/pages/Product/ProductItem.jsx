import { Card } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

const ProductItem = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="w-[calc(20%-16px)] min-w-[200px] max-w-[280px]">
      <Card
        hoverable
        onClick={handleProductClick}
        cover={
          <img
            alt={product.name}
            src={product.coverImage}
            className="h-[260px] object-cover"
          />
        }
      >
        <Meta
          className="text-left"
          title={
            <h3 className="text-base font-medium truncate">{`${product.name} ${product.sku} (${product.color})`}</h3>
          }
          description={
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-col">
                {product.discount > 0 && (
                  <span className="text-red-500 font-medium">
                    {Math.round(
                      ((product.price * (1 - product.discount / 100)) / 1000) *
                        1000
                    ).toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                )}
                <span
                  className={
                    product.discount > 0
                      ? "line-through text-gray-400"
                      : "font-medium"
                  }
                >
                  {product.price.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              {product.discount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white rounded-md text-sm">
                  -{product.discount}%
                </span>
              )}
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default ProductItem;
