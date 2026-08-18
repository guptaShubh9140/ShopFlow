import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedOrder, setExpandedOrder] = useState(null);

  // =================================
  // Fetch orders
  // =================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "shopflow_token"
      );

      if (!token) {
        setError(
          "Please login to view your orders."
        );
        return;
      }

      const response = await api.get("/orders/my");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Orders error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =================================
  // Format date
  // =================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =================================
  // Status styles
  // =================================

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return {
          wrapper:
            "bg-green-50 text-green-700 border-green-200",
          dot: "bg-green-500",
          icon: "✓",
        };

      case "Shipped":
        return {
          wrapper:
            "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          icon: "🚚",
        };

      case "Processing":
        return {
          wrapper:
            "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
          icon: "⚙",
        };

      case "Cancelled":
        return {
          wrapper:
            "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          icon: "×",
        };

      default:
        return {
          wrapper:
            "bg-yellow-50 text-yellow-700 border-yellow-200",
          dot: "bg-yellow-500",
          icon: "○",
        };
    }
  };

  // =================================
  // Loading
  // =================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="animate-pulse mb-8">

            <div className="h-4 bg-slate-200 rounded w-32 mb-3" />

            <div className="h-10 bg-slate-200 rounded w-64 mb-3" />

            <div className="h-5 bg-slate-200 rounded w-96 max-w-full" />

          </div>

          <div className="space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse"
              >

                <div className="flex justify-between mb-6">

                  <div>
                    <div className="h-5 bg-slate-200 rounded w-40 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-28" />
                  </div>

                  <div className="h-8 bg-slate-200 rounded-full w-28" />

                </div>

                <div className="space-y-3">

                  {[1, 2].map((row) => (
                    <div
                      key={row}
                      className="flex gap-4"
                    >
                      <div className="w-16 h-16 bg-slate-200 rounded-xl" />

                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                        <div className="h-4 bg-slate-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))}

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    );
  }

  // =================================
  // Error
  // =================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="bg-white border border-red-200 rounded-3xl p-10 text-center max-w-md w-full shadow-sm">

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center text-4xl">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Unable to load orders
          </h1>

          <p className="text-slate-500 mb-7">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =================================
  // Empty state
  // =================================

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center max-w-lg w-full shadow-sm">

          <div className="w-24 h-24 mx-auto mb-7 rounded-full bg-blue-50 flex items-center justify-center text-5xl">
            📦
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            No orders yet
          </h1>

          <p className="text-slate-500 leading-6 mb-8">
            You haven't placed an order yet.
            Start shopping and your orders will
            appear here.
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            ShopFlow Account
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                My Orders
              </h1>

              <p className="mt-2 text-slate-500">
                Track and manage your recent purchases.
              </p>

            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

        {/* ================================= */}
        {/* ORDER COUNT */}
        {/* ================================= */}

        <div className="flex items-center gap-2 mb-5 text-sm text-slate-500">

          <span className="font-semibold text-slate-900">
            {orders.length}
          </span>

          {orders.length === 1
            ? "order"
            : "orders"}

        </div>

        {/* ================================= */}
        {/* ORDERS */}
        {/* ================================= */}

        <div className="space-y-5">

          {orders.map((order) => {

            const statusStyles =
              getStatusStyles(order.status);

            const isExpanded =
              expandedOrder === order._id;

            const itemCount =
              order.items?.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              ) || 0;

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >

                {/* ================================= */}
                {/* ORDER HEADER */}
                {/* ================================= */}

                <div className="p-5 sm:p-6">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="text-sm text-slate-500">
                          Order
                        </span>

                        <span className="font-bold text-slate-900">
                          #
                          {order._id
                            ?.slice(-8)
                            .toUpperCase()}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Placed on{" "}
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                    </div>

                    {/* Status */}
                    <div
                      className={`inline-flex self-start sm:self-auto items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${statusStyles.wrapper}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                      />

                      {statusStyles.icon}

                      {order.status || "Pending"}

                    </div>

                  </div>

                  {/* ================================= */}
                  {/* ORDER SUMMARY */}
                  {/* ================================= */}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">

                    <div>

                      <p className="text-xs text-slate-500 mb-1">
                        Items
                      </p>

                      <p className="font-semibold text-slate-900">
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-500 mb-1">
                        Payment
                      </p>

                      <p className="font-semibold text-slate-900">
                        {order.paymentMethod ||
                          "COD"}
                      </p>

                    </div>

                    <div className="col-span-2 sm:col-span-1">

                      <p className="text-xs text-slate-500 mb-1">
                        Total
                      </p>

                      <p className="font-bold text-lg text-slate-900">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ================================= */}
                {/* PRODUCTS */}
                {/* ================================= */}

                <div className="border-t border-slate-100">

                  <div className="p-5 sm:p-6 space-y-4">

                    {(isExpanded
                      ? order.items
                      : order.items?.slice(0, 2)
                    )?.map((item, index) => {

                      const product =
                        item.product;

                      const image =
                        item.image ||
                        product?.image;

                      return (
                        <div
                          key={
                            item._id ||
                            `${order._id}-${index}`
                          }
                          className="flex items-center gap-4"
                        >

                          {/* Image */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center">

                            {image ? (

                              <img
                                src={image}
                                alt={
                                  item.name ||
                                  product?.name ||
                                  "Product"
                                }
                                className="w-full h-full object-contain p-2"
                              />

                            ) : (

                              <span className="text-2xl">
                                📦
                              </span>

                            )}

                          </div>

                          {/* Product */}
                          <div className="flex-1 min-w-0">

                            <p className="font-semibold text-slate-900 truncate">
                              {item.name ||
                                product?.name ||
                                "Product"}
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              ₹
                              {Number(
                                item.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}{" "}
                              ×{" "}
                              {item.quantity}
                            </p>

                          </div>

                          {/* Total */}
                          <div className="text-right">

                            <p className="font-semibold text-slate-900">
                              ₹
                              {(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 0
                                )
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </div>
                      );
                    })}

                  </div>

                  {/* More items */}
                  {order.items?.length > 2 && (

                    <button
                      onClick={() =>
                        setExpandedOrder(
                          isExpanded
                            ? null
                            : order._id
                        )
                      }
                      className="w-full border-t border-slate-100 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-slate-50 transition"
                    >
                      {isExpanded
                        ? "Show less ↑"
                        : `View ${
                            order.items.length - 2
                          } more item${
                            order.items.length - 2 ===
                            1
                              ? ""
                              : "s"
                          } ↓`}
                    </button>

                  )}

                </div>

                {/* ================================= */}
                {/* SHIPPING INFO */}
                {/* ================================= */}

                <div className="border-t border-slate-100 p-5 sm:p-6">

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>

                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Delivery Address
                      </p>

                      <div className="text-sm text-slate-600 leading-6">

                        <p>
                          {order.shippingAddress
                            ?.address ||
                            "Address unavailable"}
                        </p>

                        <p>
                          {order.shippingAddress
                            ?.city || ""}
                          {order.shippingAddress
                            ?.city &&
                          order.shippingAddress
                            ?.state
                            ? ", "
                            : ""}
                          {order.shippingAddress
                            ?.state || ""}
                        </p>

                        <p>
                          {order.shippingAddress
                            ?.pincode || ""}
                        </p>

                      </div>

                    </div>

                    <div>

                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Order Information
                      </p>

                      <div className="space-y-1 text-sm text-slate-600">

                        <p>
                          <span className="text-slate-400">
                            Placed:
                          </span>{" "}
                          {formatDateTime(
                            order.createdAt
                          )}
                        </p>

                        {order.updatedAt && (
                          <p>
                            <span className="text-slate-400">
                              Updated:
                            </span>{" "}
                            {formatDateTime(
                              order.updatedAt
                            )}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* ================================= */}
        {/* FOOTER MESSAGE */}
        {/* ================================= */}

        <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-5">

          <div className="flex gap-4">

            <div className="text-xl">
              💡
            </div>

            <div>

              <p className="font-semibold text-blue-900">
                Need help with an order?
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Keep your order ID handy when contacting
                support about your purchase.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Orders;