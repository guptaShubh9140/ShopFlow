import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { getCartCount } = useCart();

  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==========================================
  // Load logged-in user
  // ==========================================

  useEffect(() => {
    const loadUser = () => {
      const savedUser =
        localStorage.getItem("shopflow_user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error(
            "Failed to read user:",
            error
          );
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    // Listen for login/logout changes
    window.addEventListener(
      "shopflow-auth-change",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "shopflow-auth-change",
        loadUser
      );
    };
  }, [location]);

  // ==========================================
  // Close mobile menu when route changes
  // ==========================================

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("shopflow_token");
    localStorage.removeItem("shopflow_user");

    window.dispatchEvent(
      new Event("shopflow-auth-change")
    );

    setUser(null);

    navigate("/login");
  };

  // ==========================================
  // NavLink styles
  // ==========================================

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "text-blue-600"
        : "text-slate-600 hover:text-blue-600"
    }`;

  // ==========================================
  // Cart count
  // ==========================================

  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-18 min-h-[72px] flex items-center justify-between">

          {/* ================================= */}
          {/* LOGO */}
          {/* ================================= */}

          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group"
          >

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition">

              <span className="text-xl">
                🛒
              </span>

            </div>

            <div className="hidden sm:block">

              <div className="text-xl font-extrabold tracking-tight text-slate-900">
                Shop<span className="text-blue-600">Flow</span>
              </div>

              <p className="text-[10px] text-slate-400 font-medium -mt-1">
                Smart shopping
              </p>

            </div>

          </Link>

          {/* ================================= */}
          {/* DESKTOP NAVIGATION */}
          {/* ================================= */}

          <nav className="hidden md:flex items-center gap-1">

            <NavLink
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
            >
              Products
            </NavLink>

            {user && (
              <NavLink
                to="/orders"
                className={navLinkClass}
              >
                My Orders
              </NavLink>
            )}

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={navLinkClass}
              >
                Admin Dashboard
              </NavLink>
            )}

          </nav>

          {/* ================================= */}
          {/* DESKTOP RIGHT SIDE */}
          {/* ================================= */}

          <div className="hidden md:flex items-center gap-3">

            {/* Cart */}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition"
            >

              <span className="text-base">
                🛒
              </span>

              <span>
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[21px] h-[21px] px-1 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}

            </Link>

            {/* User */}

            {user ? (
              <>

                <div className="flex items-center gap-2.5 px-2">

                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <div className="hidden lg:block max-w-[130px]">

                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.name || "User"}
                    </p>

                    <p className="text-[11px] text-slate-400 capitalize">
                      {user.role || "customer"}
                    </p>

                  </div>

                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>

              </>
            ) : (
              <>

                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
                >
                  Create Account
                </Link>

              </>
            )}

          </div>

          {/* ================================= */}
          {/* MOBILE RIGHT SIDE */}
          {/* ================================= */}

          <div className="md:hidden flex items-center gap-2">

            {/* Mobile Cart */}

            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-blue-50 transition"
            >

              <span>
                🛒
              </span>

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}

            </Link>

            {/* Hamburger */}

            <button
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="w-10 h-10 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 transition"
              aria-label="Toggle menu"
            >

              <span
                className={`w-5 h-0.5 bg-slate-700 transition ${
                  mobileMenuOpen
                    ? "rotate-45 translate-y-2"
                    : ""
                }`}
              />

              <span
                className={`w-5 h-0.5 bg-slate-700 transition ${
                  mobileMenuOpen
                    ? "opacity-0"
                    : ""
                }`}
              />

              <span
                className={`w-5 h-0.5 bg-slate-700 transition ${
                  mobileMenuOpen
                    ? "-rotate-45 -translate-y-2"
                    : ""
                }`}
              />

            </button>

          </div>

        </div>

        {/* ================================= */}
        {/* MOBILE MENU */}
        {/* ================================= */}

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4">

            <nav className="flex flex-col gap-1">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                🏠 Home
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                🛍️ Products
              </NavLink>

              {user && (
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl font-semibold ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  📦 My Orders
                </NavLink>
              )}

              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl font-semibold ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    📊 Admin Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl font-semibold ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    📦 Manage Orders
                  </NavLink>

                  <NavLink
                    to="/admin/products"
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl font-semibold ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    🛒 Manage Products
                  </NavLink>
                </>
              )}

              <Link
                to="/cart"
                className="px-4 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

            </nav>

            {/* Mobile account section */}

            <div className="border-t border-slate-100 mt-3 pt-4">

              {user ? (
                <div className="px-4">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        {user.name}
                      </p>

                      <p className="text-xs text-slate-500 capitalize">
                        {user.role ||
                          "customer"}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-red-600 transition"
                  >
                    Logout
                  </button>

                </div>
              ) : (
                <div className="flex flex-col gap-2 px-4">

                  <Link
                    to="/login"
                    className="w-full text-center py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="w-full text-center py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    Create Account
                  </Link>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </header>
  );
};

export default Navbar;