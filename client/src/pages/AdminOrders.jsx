import { useEffect, useState } from "react";
import api from "../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        {
          status,
        }
      );

      // Refresh orders
      fetchOrders();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update order"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Order Management
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-6 shadow-sm"
            >

              {/* Order Header */}

              <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-mono text-sm">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-medium">
                    {order.user?.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.user?.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-xl font-bold">
                    ₹{order.totalAmount}
                  </p>
                </div>

              </div>

              {/* Items */}

              <div className="border-t pt-4">

                <h3 className="font-semibold mb-3">
                  Items
                </h3>

                <div className="space-y-3">

                  {order.items.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >

                        <div>
                          <p className="font-medium">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            ₹{item.price} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          ₹
                          {item.price *
                            item.quantity}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* Status */}

              <div className="border-t mt-6 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <span className="font-semibold">
                    Current Status:{" "}
                  </span>

                  <span>
                    {order.status}
                  </span>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-4 py-2"
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminOrders;