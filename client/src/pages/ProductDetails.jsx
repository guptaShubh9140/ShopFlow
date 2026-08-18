import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  // ===============================
  // Fetch product
  // ===============================
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ===============================
  // Increase quantity
  // ===============================
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  // ===============================
  // Decrease quantity
  // ===============================
  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  // ===============================
  // Add to cart
  // ===============================
  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  // ===============================
  // Buy now
  // ===============================
  const handleBuyNow = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/cart");
  };

  // ===============================
  // Loading state
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="animate-pulse">

            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-slate-200 rounded w-48 mb-8"></div>

            <div className="grid lg:grid-cols-2 gap-10">

              {/* Image */}
              <div className="h-[500px] bg-slate-200 rounded-3xl"></div>

              {/* Details */}
              <div className="space-y-5">

                <div className="h-6 bg-slate-200 rounded w-24"></div>

                <div className="h-12 bg-slate-200 rounded w-4/5"></div>

                <div className="h-6 bg-slate-200 rounded w-32"></div>

                <div className="h-10 bg-slate-200 rounded w-40"></div>

                <div className="h-24 bg-slate-200 rounded"></div>

                <div className="h-14 bg-slate-200 rounded"></div>

                <div className="h-14 bg-slate-200 rounded"></div>

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ===============================
  // Error / not found
  // ===============================
  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-md shadow-sm">

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center text-4xl">
            📦
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Product not found
          </h1>

          <p className="text-slate-500 mb-7">
            {error || "This product is no longer available."}
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            ← Back to Products
          </Link>

        </div>

      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const isLowStock =
    product.stock > 0 && product.stock <= 5;

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================================= */}
        {/* BREADCRUMB */}
        {/* ================================= */}

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">

          <Link
            to="/products"
            className="hover:text-blue-600 transition"
          >
            Products
          </Link>

          <span>›</span>

          <span className="text-slate-900 font-medium truncate">
            {product.name}
          </span>

        </div>

        {/* ================================= */}
        {/* PRODUCT */}
        {/* ================================= */}

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          <div className="grid lg:grid-cols-2">

            {/* ================================= */}
            {/* IMAGE SECTION */}
            {/* ================================= */}

            <div className="p-5 sm:p-8 lg:p-10">

              <div className="relative bg-slate-50 rounded-2xl overflow-hidden h-[400px] sm:h-[500px] flex items-center justify-center">

                {/* Category */}
                <div className="absolute top-5 left-5 z-10">

                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
                    {product.category}
                  </span>

                </div>

                {imageError || !product.image ? (

                  <div className="flex flex-col items-center justify-center text-slate-400">

                    <div className="text-7xl mb-4">
                      📦
                    </div>

                    <p className="text-sm">
                      Image unavailable
                    </p>

                  </div>

                ) : (

                  <img
                    src={product.image}
                    alt={product.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-contain p-8 transition duration-500 hover:scale-105"
                  />

                )}

              </div>

            </div>

            {/* ================================= */}
            {/* DETAILS SECTION */}
            {/* ================================= */}

            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

              {/* Category */}
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                {product.category}
              </p>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">

                <div className="flex items-center gap-1 text-yellow-500">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>

                <span className="text-sm text-slate-500">
                  4.8 · Highly rated
                </span>

              </div>

              {/* Price */}
              <div className="mt-6">

                <span className="text-4xl font-bold text-slate-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                <span className="ml-3 text-sm text-slate-500">
                  Inclusive of all taxes
                </span>

              </div>

              {/* Description */}
              <div className="mt-7">

                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Description
                </h2>

                <p className="text-slate-600 leading-7">
                  {product.description}
                </p>

              </div>

              {/* Stock */}
              <div className="mt-6">

                {isOutOfStock ? (

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold">
                    <span>●</span>
                    Out of stock
                  </div>

                ) : isLowStock ? (

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-700 text-sm font-semibold">
                    <span>●</span>
                    Only {product.stock} left in stock
                  </div>

                ) : (

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold">
                    <span>●</span>
                    In stock · {product.stock} available
                  </div>

                )}

              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 my-7"></div>

              {/* Quantity */}
              {!isOutOfStock && (
                <div>

                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Quantity
                  </p>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">

                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-12 h-12 flex items-center justify-center text-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        −
                      </button>

                      <span className="w-14 text-center font-bold text-slate-900">
                        {quantity}
                      </span>

                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= product.stock}
                        className="w-12 h-12 flex items-center justify-center text-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        +
                      </button>

                    </div>

                    <div className="text-right">

                      <p className="text-xs text-slate-500">
                        Total
                      </p>

                      <p className="text-xl font-bold text-slate-900">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* Buttons */}
              <div className="mt-7 grid sm:grid-cols-2 gap-3">

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`h-14 rounded-xl font-semibold transition ${
                    isOutOfStock
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : added
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : added
                    ? "✓ Added to Cart"
                    : "🛒 Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`h-14 rounded-xl font-semibold transition ${
                    isOutOfStock
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "border border-slate-300 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Buy Now →
                </button>

              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 mt-7 pt-7 border-t border-slate-200">

                <div className="text-center">

                  <div className="text-xl mb-1">
                    🚚
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    Fast Delivery
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-xl mb-1">
                    🔒
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    Secure Payment
                  </p>

                </div>

                <div className="text-center">

                  <div className="text-xl mb-1">
                    ✓
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    Quality Assured
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* BACK LINK */}
        {/* ================================= */}

        <div className="mt-8">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            ← Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;