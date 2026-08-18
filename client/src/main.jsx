import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>

      <App />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius: "12px",
            background: "#0f172a",
            color: "#fff",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "600",
          },
        }}
      />

    </CartProvider>
  </StrictMode>
);