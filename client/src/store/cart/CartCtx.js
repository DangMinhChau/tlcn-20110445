import { createContext } from "react";

const CartCtx = createContext({
  cartItems: [],
  addToCart: () => {},
  removeItem: () => {},
  clearCart: () => {},
  checkStockAll: () => {},
});

export default CartCtx;
