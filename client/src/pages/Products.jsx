import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // Fetch products
  // ===============================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data.products || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===============================
  // Categories
  // ===============================
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // ===============================
  // Search + Filter + Sort
  // ===============================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();

      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm)
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    // Sorting
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name-az":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "name-za":
        result.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, search, category, sort]);

  // ===============================
  // Clear filters
  // ===============================
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
  };

  // ===============================
  // Loading UI
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* Heading skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-10 w-64 bg-slate-200 rounded-lg mb-3"></div>
            <div className="h-5 w-96 max-w-full bg-slate-200 rounded"></div>
          </div>

          {/* Filter skeleton */}
          <div className="animate-pulse bg-white border border-slate-200 rounded-2xl p-5 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="h-12 bg-slate-200 rounded-xl flex-1"></div>
              <div className="h-12 bg-slate-200 rounded-xl md:w-48"></div>
              <div className="h-12 bg-slate-200 rounded-xl md:w-48"></div>
            </div>
          </div>

          {/* Product skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-slate-200"></div>

                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // Error UI
  // ===============================
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md shadow-sm">

          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center text-3xl">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Something went wrong
          </h2>

          <p className="text-slate-500 mb-6">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Try Again
          </button>

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

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                ShopFlow Store
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Explore Products
              </h1>

              <p className="mt-2 text-slate-500">
                Find the products you need at great prices.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              products found
            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* SEARCH + FILTER PANEL */}
        {/* ================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-8">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />

            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition lg:w-52"
            >
              <option value="default">
                Sort: Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name-az">
                Name: A → Z
              </option>

              <option value="name-za">
                Name: Z → A
              </option>
            </select>

          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-5">

            <span className="text-sm font-semibold text-slate-600 mr-1">
              Category:
            </span>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}

          </div>

          {/* Active filters */}
          {(search || category !== "All" || sort !== "default") && (
            <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">

              <p className="text-sm text-slate-500">
                Filters applied
              </p>

              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>

            </div>
          )}

        </div>

        {/* ================================= */}
        {/* PRODUCT COUNT */}
        {/* ================================= */}

        <div className="flex items-center justify-between mb-5">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {products.length}
            </span>{" "}
            products
          </p>

        </div>

        {/* ================================= */}
        {/* PRODUCTS */}
        {/* ================================= */}

        {filteredProducts.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center">

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center text-4xl">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No products found
            </h2>

            <p className="text-slate-500 max-w-md mx-auto mb-6">
              We couldn't find any products matching your search or selected filters.
            </p>

            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Products;