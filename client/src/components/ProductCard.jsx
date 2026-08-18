import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    setAdding(true);

    addToCart(product);

    toast.success(`${product.name} added to cart`);

    setTimeout(() => {
      setAdding(false);
    }, 700);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* ============================= */}
      {/* IMAGE */}
      {/* ============================= */}

      <Link to={`/products/${product._id}`}>

        <div className="relative h-64 bg-slate-100 overflow-hidden">

          {!imageError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">

              <span className="text-6xl">
                📦
              </span>

              <span className="mt-2 text-sm text-slate-400">
                Product image
              </span>

            </div>
          )}

          {/* Category */}

          <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-bold text-slate-700 shadow-sm">
            {product.category}
          </span>

          {/* Stock */}

          {product.stock <= 0 && (
            <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
              Out of stock
            </span>
          )}

          {product.stock > 0 &&
            product.stock <= 5 && (
              <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold">
                Only {product.stock} left
              </span>
            )}

        </div>

      </Link>

      {/* ============================= */}
      {/* CONTENT */}
      {/* ============================= */}

      <div className="p-5">

        <Link to={`/products/${product._id}`}>

          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
            {product.name}
          </h3>

        </Link>

        <p className="mt-2 text-sm text-slate-500 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        {/* Price */}

        <div className="mt-5 flex items-center justify-between">

          <div>

            <p className="text-xl font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            {product.stock > 0 && (
              <p className="text-xs text-green-600 font-medium mt-1">
                ✓ In stock
              </p>
            )}

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-5 flex gap-2">

          <Link
            to={`/products/${product._id}`}
            className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          >
            {adding
              ? "Added ✓"
              : product.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;