import { ADD_TO_CART, REMOVE_ITEM, CLEAR_CART, CHECK_STOCK } from "./Types";

const CartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      // quantity cộng từ page add
      // thêm produc: productId, price, size, quantity, coverImage-cái này xem xét
      const newItem = action.payload;

      const existItem = state.cartItems.find(
        (item) =>
          item.productId === newItem.productId && item.size === newItem.size
      );

      const newCartItems = existItem
        ? state.cartItems.map((item) =>
            item.productId === existItem.productId &&
            item.size === existItem.size
              ? newItem
              : item
          )
        : [...state.cartItems, newItem];
      //   thêm vào localStorage (key có thì nó replace all)
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return {
        cartItems: newCartItems,
      };
    }
    case REMOVE_ITEM: {
      // console.log(action.payload);
      //   xóa bớt localStorage (key có thì nó replace all)
      const newCartItems = state.cartItems.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.size === action.payload.size
          )
      );
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return {
        // không cần check stock vì chỉ check ở add và check ở cart page, còn trừ s được khi vào cart page mà hết stock nó disable luôn
        cartItems: newCartItems,
      };
    }
    case CLEAR_CART: {
      localStorage.removeItem("cartItems");
      return {
        cartItems: [],
      };
    }
    case CHECK_STOCK: {
      return true;
    }
    default:
      return state;
  }
};

export default CartReducer;
