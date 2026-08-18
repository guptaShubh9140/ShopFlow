import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("shopflow_cart");

    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);

      return [];
    }
  });

  // ==========================================
  // Save cart to localStorage
  // ==========================================

  useEffect(() => {
    localStorage.setItem("shopflow_cart", JSON.stringify(cart));
  }, [cart]);

  // ==========================================
  // Add product to cart
  // ==========================================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item._id === product._id);

      // Product already exists
      if (existingItem) {
        // Prevent quantity from exceeding stock
        if (existingItem.quantity >= product.stock) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      // Product is out of stock
      if (product.stock <= 0) {
        return currentCart;
      }

      // Add new product
      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ==========================================
  // Remove product
  // ==========================================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== productId),
    );
  };

  // ==========================================
  // Increase quantity
  // ==========================================

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item._id !== productId) {
          return item;
        }

        // Don't exceed available stock
        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  };

  // ==========================================
  // Decrease quantity
  // ==========================================

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // ==========================================
  // Clear entire cart
  // ==========================================

  const clearCart = () => {
    setCart([]);
  };

  // ==========================================
  // Calculate total price
  // ==========================================

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // ==========================================
  // Calculate total items
  // ==========================================

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // ==========================================
  // Provider
  // ==========================================

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ==========================================
// Custom Hook
// ==========================================

export const useCart = () => useContext(CartContext);
