import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
  } = useCart();

  const [imageErrors, setImageErrors] = useState({});

  const subtotal = getCartTotal();

  // Free shipping above ₹2000
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 99;

  const total = subtotal + shipping;

  const handleImageError = (productId) => {
    setImageErrors((current) => ({
      ...current,
      [productId]: true,
    }));
  };

  // ===============================
  // Empty Cart
  // ===============================
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 sm:p-14 text-center max-w-lg w-full">
          <div className="w-24 h-24 mx-auto mb-7 rounded-full bg-blue-50 flex items-center justify-center text-5xl">
            🛒
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Your cart is empty
          </h1>

          <p className="text-slate-500 leading-6 mb-8">
            Looks like you haven't added anything to your cart yet. Explore our
            products and find something you'll love.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Start Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition mb-4"
          >
            ← Continue Shopping
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                ShopFlow
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Shopping Cart
              </h1>
            </div>

            <p className="text-slate-500">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* ================================= */}
        {/* CART LAYOUT */}
        {/* ================================= */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ================================= */}
          {/* CART ITEMS */}
          {/* ================================= */}

          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Image */}
                  <Link
                    to={`/products/${item._id}`}
                    className="w-full sm:w-32 h-32 shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center"
                  >
                    {imageErrors[item._id] || !item.image ? (
                      <div className="text-4xl text-slate-300">📦</div>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={() => handleImageError(item._id)}
                        className="w-full h-full object-contain p-3 hover:scale-105 transition"
                      />
                    )}
                  </Link>

                  {/* Product Information */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                          {item.category}
                        </p>

                        <Link
                          to={`/products/${item._id}`}
                          className="text-lg font-bold text-slate-900 hover:text-blue-600 transition"
                        >
                          {item.name}
                        </Link>

                        <p className="text-sm text-slate-500 mt-1">
                          ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => {
                          removeFromCart(item._id);

                          toast.success(`${item.name} removed from cart`);
                        }}
                        className="text-slate-400 hover:text-red-500 transition text-sm"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-auto pt-5">
                      {/* Quantity */}
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Quantity</p>

                        <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => decreaseQuantity(item._id)}
                            className="w-10 h-10 flex items-center justify-center text-lg text-slate-600 hover:bg-slate-100 transition"
                          >
                            −
                          </button>

                          <span className="w-12 text-center font-semibold text-slate-900">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item._id)}
                            className="w-10 h-10 flex items-center justify-center text-lg text-slate-600 hover:bg-slate-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="sm:text-right">
                        <p className="text-xs text-slate-500 mb-1">
                          Item total
                        </p>

                        <p className="text-xl font-bold text-slate-900">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================================= */}
          {/* ORDER SUMMARY */}
          {/* ================================= */}

          <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-semibold text-slate-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-500">Shipping</span>

                {shipping === 0 ? (
                  <span className="font-semibold text-green-600">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-900">
                    ₹{shipping}
                  </span>
                )}
              </div>

              {/* Free shipping message */}
              {subtotal > 0 && subtotal < 2000 && (
                <div className="bg-blue-50 text-blue-700 rounded-xl p-3 text-xs leading-5 mb-5">
                  Add ₹{(2000 - subtotal).toLocaleString("en-IN")} more to get
                  free shipping.
                </div>
              )}

              <div className="border-t border-slate-200 my-5"></div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-900">Total</span>

                <span className="text-2xl font-bold text-slate-900">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Checkout */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full h-13 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Checkout →
              </button>

              {/* Security */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                  <span>💳</span>
                  <span>Safe payment processing</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>🚚</span>
                  <span>Reliable delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
