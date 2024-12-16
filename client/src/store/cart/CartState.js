import React, { useReducer } from "react";
import CartCtx from "./CartCtx";
import CartReducer from "./CartReducer";
import { ADD_TO_CART, REMOVE_ITEM, CLEAR_CART, CHECK_STOCK } from "./Types";

const CartState = ({ children }) => {
  const initalState = {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  };

  const [state, dispatch] = useReducer(CartReducer, initalState);

  const addToCart = (item) => {
    dispatch({ type: ADD_TO_CART, payload: item });
  };
  const removeItem = (item) => {
    dispatch({ type: REMOVE_ITEM, payload: item });
  };
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };
  const checkStockAll = () => {
    dispatch({ type: CHECK_STOCK });
  };
  return (
    <CartCtx.Provider
      value={{
        cartItems: initalState.cartItems,
        addToCart,
        removeItem,
        clearCart,
        checkStockAll,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
};

export default CartState;
