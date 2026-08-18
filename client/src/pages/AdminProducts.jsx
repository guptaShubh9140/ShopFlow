import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Error state
  const [error, setError] = useState("");

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // Handle Input
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear old error when user starts typing
    if (error) {
      setError("");
    }
  };

  // =========================
  // Reset Form
  // =========================
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
  };

  // =========================
  // Add / Update Product
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      // Frontend validation
      if (formData.name.trim().length < 2) {
        setError(
          "Product name must be at least 2 characters."
        );
        return;
      }

      if (formData.description.trim().length < 5) {
        setError(
          "Description must be at least 5 characters."
        );
        return;
      }

      if (!formData.category.trim()) {
        setError("Category is required.");
        return;
      }

      if (
        formData.price === "" ||
        Number(formData.price) < 0
      ) {
        setError("Price must be 0 or greater.");
        return;
      }

      if (
        formData.stock === "" ||
        Number(formData.stock) < 0 ||
        !Number.isInteger(Number(formData.stock))
      ) {
        setError(
          "Stock must be a non-negative whole number."
        );
        return;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        image: formData.image.trim(),
        stock: Number(formData.stock),
      };

      // UPDATE
      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          productData
        );

        alert("Product updated successfully!");
      }

      // CREATE
      else {
        await api.post(
          "/products",
          productData
        );

        alert("Product created successfully!");
      }

      // Reset form
      resetForm();

      // Reload products
      await fetchProducts();

    } catch (error) {
      console.error("Save product error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Edit Product
  // =========================
  const handleEdit = (product) => {
    setError("");

    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Delete Product
  // =========================
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(productId);
      setError("");

      await api.delete(
        `/products/${productId}`
      );

      alert("Product deleted successfully!");

      await fetchProducts();

    } catch (error) {
      console.error("Delete product error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete product. Please try again."
      );
    } finally {
      setDeleting(null);
    }
  };

  // =========================
  // Loading Screen
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">
            Loading products...
          </div>

          <div className="text-gray-500">
            Please wait
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Main UI
  // =========================
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">
        Product Management
      </h1>

      {/* Global Error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center">

          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="font-bold text-red-700 hover:text-red-900"
          >
            ✕
          </button>

        </div>
      )}

      {/* =========================
          Product Form
      ========================= */}
      <div className="border rounded-xl p-6 mb-10 shadow-sm">

        <h2 className="text-xl font-bold mb-6">
          {editingId
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Wireless Headphones"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Electronics"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="2499"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="25"
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="https://..."
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={5}
              rows="4"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Product description"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="border px-6 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* =========================
          Product List
      ========================= */}
      <div>

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-bold">
            All Products
          </h2>

          <span className="text-gray-500">
            {products.length} products
          </span>

        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="border rounded-xl p-10 text-center">
            <p className="text-gray-500 mb-4">
              No products found.
            </p>

            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        ) : (

          <div className="overflow-x-auto border rounded-xl">

            <table className="w-full">

              <thead>
                <tr className="border-b bg-gray-50 text-left">

                  <th className="p-4">
                    Product
                  </th>

                  <th className="p-4">
                    Category
                  </th>

                  <th className="p-4">
                    Price
                  </th>

                  <th className="p-4">
                    Stock
                  </th>

                  <th className="p-4">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Product */}
                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={
                            product.image ||
                            "https://placehold.co/100x100?text=Product"
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/100x100?text=Product";
                          }}
                        />

                        <div>

                          <p className="font-medium">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {product._id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Category */}
                    <td className="p-4">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-semibold">
                      ₹{product.price}
                    </td>

                    {/* Stock */}
                    <td className="p-4">

                      <span
                        className={
                          product.stock === 0
                            ? "text-red-600 font-semibold"
                            : product.stock <= 5
                            ? "text-orange-600 font-semibold"
                            : "text-green-600"
                        }
                      >
                        {product.stock}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="p-4">

                      <div className="flex gap-2">

                        {/* Edit */}
                        <button
                          onClick={() =>
                            handleEdit(product)
                          }
                          disabled={
                            deleting !== null ||
                            saving
                          }
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          disabled={
                            deleting !== null ||
                            saving
                          }
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === product._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminProducts;