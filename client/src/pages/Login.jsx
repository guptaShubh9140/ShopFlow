import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShoppingBag } from "lucide-react";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already logged-in users
  useEffect(() => {
    const token = localStorage.getItem("shopflow_token");

    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    // Client-side validation
    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: cleanEmail,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response.");
      }

      localStorage.setItem(
        "shopflow_token",
        token
      );

      localStorage.setItem(
        "shopflow_user",
        JSON.stringify(user)
      );

      window.dispatchEvent(
      new Event("shopflow-auth-change")
    );

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

        <div className="grid lg:grid-cols-2">

          {/* ================================= */}
          {/* BRANDING PANEL */}
          {/* ================================= */}

          <div className="hidden lg:flex relative overflow-hidden bg-blue-600 p-10 text-white">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500 opacity-50" />

            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-700 opacity-50" />

            <div className="relative z-10 flex flex-col justify-between w-full">

              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                  🛒
                </div>

                <span className="text-2xl font-bold">
                  ShopFlow
                </span>
              </Link>

              <div>

                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <ShoppingBag size={40} />
                </div>

                <h2 className="text-4xl font-bold leading-tight">
                  Welcome back to
                  <span className="block text-blue-200">
                    ShopFlow.
                  </span>
                </h2>

                <p className="mt-5 max-w-md leading-7 text-blue-100">
                  Discover quality products, manage your
                  orders, and enjoy a simple shopping
                  experience.
                </p>

              </div>

              <p className="text-sm text-blue-200">
                Your shopping journey starts here.
              </p>

            </div>

          </div>

          {/* ================================= */}
          {/* LOGIN FORM */}
          {/* ================================= */}

          <div className="p-6 sm:p-10 lg:p-12">

            {/* Mobile Logo */}
            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-2"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl">
                  🛒
                </div>

                <span className="text-xl font-bold text-slate-900">
                  Shop<span className="text-blue-600">Flow</span>
                </span>

              </Link>

            </div>

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Welcome back
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Sign in to your account
              </h1>

              <p className="mt-2 text-slate-500">
                Enter your details to continue shopping.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <div className="flex gap-3">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create an account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;