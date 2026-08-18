import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Fetch products
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        setProducts(response.data.products || []);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // Featured products
  // ==========================================

  const featuredProducts = products.slice(0, 4);

  // ==========================================
  // Categories
  // ==========================================

  const categories = [
    {
      name: "Electronics",
      icon: "💻",
      description: "Smart devices & gadgets",
    },
    {
      name: "Accessories",
      icon: "🎒",
      description: "Everyday essentials",
    },
    {
      name: "Wearables",
      icon: "⌚",
      description: "Stay connected",
    },
  ];

  return (
    <main className="bg-slate-50">

      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}

      <section className="relative overflow-hidden">

        {/* Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />

        {/* Decorative circles */}

        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />

        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[620px] py-16 lg:py-20">

            {/* LEFT */}

            <div>

              {/* Badge */}

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">

                <span>✨</span>

                <span>Smart shopping made simple</span>

              </div>

              {/* Heading */}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">

                Everything you need.

                <span className="block text-blue-600 mt-2">
                  All in one place.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-6 text-lg text-slate-600 max-w-xl leading-8">

                Discover quality products, compare your
                favorites, and enjoy a simple shopping
                experience with ShopFlow.

              </p>

              {/* Buttons */}

              <div className="mt-8 flex flex-col sm:flex-row gap-4">

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition"
                >
                  Shop Now

                  <span>→</span>
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Explore Products
                </Link>

              </div>

              {/* Trust stats */}

              <div className="mt-10 flex flex-wrap gap-8">

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    100+
                  </p>

                  <p className="text-sm text-slate-500">
                    Products
                  </p>
                </div>

                <div className="w-px bg-slate-200" />

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    Fast
                  </p>

                  <p className="text-sm text-slate-500">
                    Delivery
                  </p>
                </div>

                <div className="w-px bg-slate-200" />

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    Secure
                  </p>

                  <p className="text-sm text-slate-500">
                    Shopping
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT HERO VISUAL */}

            <div className="relative hidden md:block">

              <div className="relative max-w-lg mx-auto">

                {/* Main card */}

                <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 rotate-1">

                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white min-h-[370px] flex flex-col justify-between">

                    <div>

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-medium text-blue-100">
                          SHOPFLOW
                        </span>

                        <span className="text-2xl">
                          🛒
                        </span>

                      </div>

                      <h2 className="mt-16 text-4xl font-bold leading-tight">
                        Your next
                        <br />
                        favorite product
                        <br />
                        is waiting.
                      </h2>

                    </div>

                    <div className="flex items-end justify-between">

                      <div>

                        <p className="text-blue-100 text-sm">
                          Simple. Fast. Reliable.
                        </p>

                        <p className="mt-1 font-semibold">
                          Shop smarter today.
                        </p>

                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-3xl">
                        ✨
                      </div>

                    </div>

                  </div>

                </div>

                {/* Floating product cards */}

                <div className="absolute -left-10 bottom-10 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3">

                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                    🎧
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Popular
                    </p>

                    <p className="font-bold text-slate-900">
                      Electronics
                    </p>
                  </div>

                </div>

                <div className="absolute -right-5 top-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-4">

                  <p className="text-xs text-slate-500">
                    Easy shopping
                  </p>

                  <p className="font-bold text-blue-600">
                    ✓ Secure checkout
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* CATEGORIES */}
      {/* ================================================= */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">

            <div>

              <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Shop by category
              </h2>

              <p className="mt-2 text-slate-500">
                Find what you're looking for faster.
              </p>

            </div>

            <Link
              to="/products"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              View all products →
            </Link>

          </div>

          <div className="grid sm:grid-cols-3 gap-5">

            {categories.map((category) => (
              <Link
                key={category.name}
                to="/products"
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:bg-blue-600 hover:border-blue-600 transition duration-300"
              >

                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-white">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500 group-hover:text-blue-100">
                  {category.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-blue-600 group-hover:text-white">
                  Shop now →
                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* FEATURED PRODUCTS */}
      {/* ================================================= */}

      <section className="py-20 bg-slate-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">

            <div>

              <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                Featured
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Popular products
              </h2>

              <p className="mt-2 text-slate-500">
                Check out some of our latest products.
              </p>

            </div>

            <Link
              to="/products"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Browse all →
            </Link>

          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
                >

                  <div className="h-56 bg-slate-200" />

                  <div className="p-5 space-y-3">

                    <div className="h-4 bg-slate-200 rounded w-3/4" />

                    <div className="h-4 bg-slate-200 rounded w-1/2" />

                    <div className="h-10 bg-slate-200 rounded" />

                  </div>

                </div>
              ))}

            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}

            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">

              <div className="text-5xl">
                🛍️
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No products available
              </h3>

              <p className="mt-2 text-slate-500">
                Products will appear here once they're added.
              </p>

            </div>
          )}

        </div>

      </section>

      {/* ================================================= */}
      {/* WHY SHOPFLOW */}
      {/* ================================================= */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Why ShopFlow
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Shopping made better
            </h2>

            <p className="mt-3 text-slate-500">
              Everything you need for a smooth and reliable
              online shopping experience.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Feature 1 */}

            <div className="rounded-2xl border border-slate-200 p-7 hover:shadow-lg transition">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                🚚
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Fast delivery
              </h3>

              <p className="mt-2 text-slate-500 leading-7">
                Get your favorite products delivered
                quickly and conveniently.
              </p>

            </div>

            {/* Feature 2 */}

            <div className="rounded-2xl border border-slate-200 p-7 hover:shadow-lg transition">

              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                🔒
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Secure shopping
              </h3>

              <p className="mt-2 text-slate-500 leading-7">
                Your account and shopping experience are
                protected with secure authentication.
              </p>

            </div>

            {/* Feature 3 */}

            <div className="rounded-2xl border border-slate-200 p-7 hover:shadow-lg transition">

              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">
                💬
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Simple experience
              </h3>

              <p className="mt-2 text-slate-500 leading-7">
                Search, discover, add to cart, and checkout
                without unnecessary complexity.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* CTA */}
      {/* ================================================= */}

      <section className="py-20 bg-slate-50">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-center text-white">

            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />

            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/10 rounded-full" />

            <div className="relative">

              <div className="text-4xl mb-4">
                🛒
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to start shopping?
              </h2>

              <p className="mt-4 text-blue-100 max-w-xl mx-auto">
                Explore our products and find something
                you'll love.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Start Shopping

                <span>→</span>
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-slate-950 text-slate-300">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid md:grid-cols-4 gap-10">

            {/* Brand */}

            <div className="md:col-span-2">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  🛒
                </div>

                <span className="text-xl font-bold text-white">
                  Shop<span className="text-blue-400">
                    Flow
                  </span>
                </span>

              </div>

              <p className="mt-4 text-sm text-slate-400 max-w-md leading-6">
                A modern ecommerce platform designed to
                make online shopping simple, convenient,
                and enjoyable.
              </p>

            </div>

            {/* Shop */}

            <div>

              <h3 className="font-semibold text-white">
                Shop
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm">

                <Link
                  to="/"
                  className="hover:text-white transition"
                >
                  Home
                </Link>

                <Link
                  to="/products"
                  className="hover:text-white transition"
                >
                  Products
                </Link>

                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  Cart
                </Link>

              </div>

            </div>

            {/* Account */}

            <div>

              <h3 className="font-semibold text-white">
                Account
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm">

                <Link
                  to="/login"
                  className="hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hover:text-white transition"
                >
                  Create Account
                </Link>

                <Link
                  to="/orders"
                  className="hover:text-white transition"
                >
                  My Orders
                </Link>

              </div>

            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 text-sm text-slate-500 text-center">
            © {new Date().getFullYear()} ShopFlow. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
};

export default Home;