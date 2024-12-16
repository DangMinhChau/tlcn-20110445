import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/authCtx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CartState from "./store/cart/CartState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        "client-id":
          "ARz7iP0tLE2-ytpSg23qWy9DtGyDGL4646k5d0oFR5wiYBAxpzvVhTA9RWuiogOsATHjHqIv-g9i-2iC",
      }}
    >
      <AuthContextProvider>
        <CartState>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartState>
      </AuthContextProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);
