import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/admin/analytics"
      );

      setAnalytics(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalItemsSold,
    ordersByStatus,
    lowStockProducts,
  } = analytics;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div>
              <h1 className="text-3xl font-bold">
                Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-1">
                Monitor your ShopFlow store
              </p>
            </div>

            <div className="flex gap-3">

              <Link
                to="/admin/products"
                className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
              >
                Manage Products
              </Link>

              <Link
                to="/admin/orders"
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                Manage Orders
              </Link>

            </div>

          </div>

        </div>
      </div>

      {/* Main */}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Statistics Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Revenue */}

          <div className="bg-white rounded-xl border p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>

            <p className="text-sm text-green-600 mt-2">
              From completed/non-cancelled orders
            </p>

          </div>

          {/* Orders */}

          <div className="bg-white rounded-xl border p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalOrders}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              All customer orders
            </p>

          </div>

          {/* Products */}

          <div className="bg-white rounded-xl border p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalProducts}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Active products
            </p>

          </div>

          {/* Items Sold */}

          <div className="bg-white rounded-xl border p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Items Sold
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalItemsSold}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Total quantities ordered
            </p>

          </div>

        </div>

        {/* Analytics */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Order Status */}

          <div className="bg-white rounded-xl border p-6 shadow-sm">

            <h2 className="text-xl font-bold mb-6">
              Orders by Status
            </h2>

            <div className="space-y-5">

              {Object.entries(
                ordersByStatus
              ).map(([status, count]) => {

                const total = totalOrders || 1;

                const percentage =
                  (count / total) * 100;

                return (
                  <div key={status}>

                    <div className="flex justify-between mb-2">

                      <span className="font-medium">
                        {status}
                      </span>

                      <span className="text-gray-500">
                        {count}
                      </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">

                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* Low Stock */}

          <div className="bg-white rounded-xl border p-6 shadow-sm">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Low Stock Products
              </h2>

              <Link
                to="/admin/products"
                className="text-blue-600 hover:underline text-sm"
              >
                Manage
              </Link>

            </div>

            {lowStockProducts.length === 0 ? (

              <div className="text-center py-8">

                <p className="text-green-600 font-medium">
                  All products have healthy stock.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {lowStockProducts.map(
                  (product) => (

                    <div
                      key={product._id}
                      className="flex items-center justify-between border-b pb-3"
                    >

                      <div>

                        <p className="font-medium">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>

                      </div>

                      <span
                        className={
                          product.stock === 0
                            ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                            : "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                        }
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} left`}
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

        {/* Quick Actions */}

        <div className="bg-white rounded-xl border p-6 shadow-sm">

          <h2 className="text-xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Link
              to="/admin/products"
              className="border rounded-lg p-5 hover:bg-gray-50"
            >
              <h3 className="font-semibold">
                Product Management
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add, edit, delete products and manage stock.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="border rounded-lg p-5 hover:bg-gray-50"
            >
              <h3 className="font-semibold">
                Order Management
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                View customer orders and update status.
              </p>
            </Link>

            <Link
              to="/"
              className="border rounded-lg p-5 hover:bg-gray-50"
            >
              <h3 className="font-semibold">
                View Store
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Open the customer-facing ShopFlow store.
              </p>
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;