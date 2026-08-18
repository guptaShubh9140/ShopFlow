import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    getCartTotal,
    removeFromCart,
    clearCart,
  } = useCart();

  // =================================
  // Shipping form
  // =================================

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =================================
  // Payment
  // =================================

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  // =================================
  // Loading / Error
  // =================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =================================
  // Image errors
  // =================================

  const [imageErrors, setImageErrors] = useState({});

  // =================================
  // Order calculations
  // =================================

  const subtotal = getCartTotal();

  const shipping =
    subtotal >= 2000 || subtotal === 0
      ? 0
      : 99;

  const total = subtotal + shipping;

  // =================================
  // Protect checkout from empty cart
  // =================================

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // =================================
  // Handle input
  // =================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // =================================
  // Place order
  // =================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =================================
    // Check login
    // =================================

    const token = localStorage.getItem(
      "shopflow_token"
    );

    if (!token) {
      toast.error("Please login to place your order.");
      navigate("/login");
      return;
    }

    // =================================
    // Validate cart
    // =================================

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // =================================
    // Validate address
    // =================================

    if (
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError(
        "Please complete all shipping address fields."
      );

      return;
    }

    // =================================
    // Validate pincode
    // =================================

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }

    try {
      setLoading(true);

      // =================================
      // Prepare order items
      // =================================

      const orderItems = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      // =================================
      // Create order
      // =================================

      const response = await api.post("/orders", {
        items: orderItems,

        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },

        paymentMethod,
      });

      console.log(
        "Order created:",
        response.data
      );

      // =================================
      // Clear cart
      // =================================

      clearCart();

      // =================================
      // Success message
      // =================================

      toast.success(
        "Order placed successfully!"
      );

      // =================================
      // Go to My Orders
      // =================================

      navigate("/orders");

    } catch (error) {
      console.error(
        "Order failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // Image fallback
  // =================================

  const handleImageError = (id) => {
    setImageErrors((current) => ({
      ...current,
      [id]: true,
    }));
  };

  // =================================
  // Empty cart
  // =================================

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-md shadow-sm">

          <div className="text-5xl mb-5">
            🛒
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-slate-500">
            Add some products before checking out.
          </p>

          <Link
            to="/products"
            className="inline-flex mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Browse Products
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
            to="/cart"
            className="text-sm text-slate-500 hover:text-blue-600 transition"
          >
            ← Back to Cart
          </Link>

          <div className="mt-4">

            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              ShopFlow Checkout
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              Complete your order
            </h1>

            <p className="mt-2 text-slate-500">
              Enter your delivery details and choose
              your payment method.
            </p>

          </div>

        </div>

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">

            <div className="flex items-start gap-3">

              <span>
                ⚠️
              </span>

              <div>

                <p className="font-semibold">
                  Unable to place order
                </p>

                <p className="mt-1">
                  {error}
                </p>

              </div>

            </div>

          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* ================================= */}
            {/* LEFT SIDE */}
            {/* ================================= */}

            <div className="lg:col-span-2 space-y-6">

              {/* ================================= */}
              {/* SHIPPING ADDRESS */}
              {/* ================================= */}

              <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    1
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Shipping Address
                    </h2>

                    <p className="text-sm text-slate-500">
                      Where should we deliver your order?
                    </p>

                  </div>

                </div>

                <div className="space-y-5">

                  {/* Address */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="House number, street, area..."
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition resize-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                  {/* City + State */}

                  <div className="grid sm:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Bengaluru"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Karnataka"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />

                    </div>

                  </div>

                  {/* Pincode */}

                  <div className="sm:w-1/2">

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData((current) => ({
                          ...current,
                          pincode: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        }))
                      }
                      placeholder="560001"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>

              </section>

              {/* ================================= */}
              {/* PAYMENT */}
              {/* ================================= */}

              <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    2
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Payment Method
                    </h2>

                    <p className="text-sm text-slate-500">
                      Choose how you'd like to pay.
                    </p>

                  </div>

                </div>

                <div className="space-y-3">

                  {/* COD */}

                  <label
                    className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition ${
                      paymentMethod === "COD"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={
                        paymentMethod === "COD"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      className="h-4 w-4 accent-blue-600"
                    />

                    <div className="text-2xl">
                      💵
                    </div>

                    <div className="flex-1">

                      <p className="font-semibold text-slate-900">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-slate-500">
                        Pay when your order arrives.
                      </p>

                    </div>

                  </label>

                  {/* Online */}

                  <label
                    className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition ${
                      paymentMethod === "Online"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={
                        paymentMethod === "Online"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      className="h-4 w-4 accent-blue-600"
                    />

                    <div className="text-2xl">
                      💳
                    </div>

                    <div className="flex-1">

                      <p className="font-semibold text-slate-900">
                        Online Payment
                      </p>

                      <p className="text-sm text-slate-500">
                        Secure online payment.
                      </p>

                    </div>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Demo
                    </span>

                  </label>

                </div>

                {paymentMethod === "Online" && (
                  <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-100 p-4 text-sm text-yellow-800">
                    Online payment is currently a
                    demo option. No real payment will
                    be processed.
                  </div>
                )}

              </section>

            </div>

            {/* ================================= */}
            {/* ORDER SUMMARY */}
            {/* ================================= */}

            <aside>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">

                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">

                  {cart.map((item) => (

                    <div
                      key={item._id}
                      className="flex gap-3"
                    >

                      {/* Image */}

                      <div className="relative w-16 h-16 shrink-0 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center">

                        {imageErrors[item._id] ||
                        !item.image ? (

                          <span className="text-2xl">
                            📦
                          </span>

                        ) : (

                          <img
                            src={item.image}
                            alt={item.name}
                            onError={() =>
                              handleImageError(
                                item._id
                              )
                            }
                            className="w-full h-full object-contain p-1"
                          />

                        )}

                        {/* Quantity */}

                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                          {item.quantity}
                        </span>

                      </div>

                      {/* Product information */}

                      <div className="flex-1 min-w-0">

                        <p className="font-medium text-sm text-slate-900 truncate">
                          {item.name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}
                          × {item.quantity}
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(
                              item._id
                            );

                            toast.success(
                              `${item.name} removed from cart`
                            );
                          }}
                          className="text-xs text-red-500 hover:text-red-700 mt-1 transition"
                        >
                          Remove
                        </button>

                      </div>

                      {/* Item total */}

                      <p className="font-semibold text-sm text-slate-900">
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  ))}

                </div>

                <div className="border-t border-slate-200 my-6" />

                {/* Subtotal */}

                <div className="flex justify-between text-sm mb-4">

                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-900">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* Shipping */}

                <div className="flex justify-between text-sm mb-4">

                  <span className="text-slate-500">
                    Shipping
                  </span>

                  {shipping === 0 ? (

                    <span className="font-semibold text-green-600">
                      FREE
                    </span>

                  ) : (

                    <span className="font-semibold text-slate-900">
                      ₹{shipping}
                    </span>

                  )}

                </div>

                <div className="border-t border-slate-200 my-5" />

                {/* Total */}

                <div className="flex justify-between items-center mb-6">

                  <span className="font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-slate-900">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* Place Order */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Placing Order..."
                    : "Place Order →"}
                </button>

                {/* Security */}

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

                  <div className="flex gap-3 text-sm text-slate-500">
                    <span>
                      🔒
                    </span>

                    <span>
                      Secure checkout
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm text-slate-500">
                    <span>
                      🚚
                    </span>

                    <span>
                      Reliable delivery
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm text-slate-500">
                    <span>
                      ✓
                    </span>

                    <span>
                      Order confirmation after purchase
                    </span>
                  </div>

                </div>

              </div>

            </aside>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Checkout;