import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  User,
} from "lucide-react";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect logged-in users
  useEffect(() => {
    const token = localStorage.getItem(
      "shopflow_token"
    );

    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // =================================
  // Handle input
  // =================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // =================================
  // Submit
  // =================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const name = formData.name.trim();
    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    // Name validation
    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (name.length < 2) {
      setError(
        "Name must be at least 2 characters."
      );
      return;
    }

    // Email validation
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // Depending on your backend, registration
      // may return a token or only a success message.

      if (response.data.token) {
        localStorage.setItem(
          "shopflow_token",
          response.data.token
        );

        if (response.data.user) {
          localStorage.setItem(
            "shopflow_user",
            JSON.stringify(response.data.user)
          );

          window.dispatchEvent(
          new Event("shopflow-auth-change")
          );
        }

        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
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
          {/* REGISTER FORM */}
          {/* ================================= */}

          <div className="order-2 p-6 sm:p-10 lg:order-1 lg:p-12">

            {/* Mobile logo */}
            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-2"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl">
                  🛒
                </div>

                <span className="text-xl font-bold text-slate-900">
                  Shop<span className="text-blue-600">
                    Flow
                  </span>
                </span>

              </Link>

            </div>

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Get started
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Create your account
              </h1>

              <p className="mt-2 text-slate-500">
                Join ShopFlow and start shopping today.
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

              {/* Name */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Shubham Gupta"
                    autoComplete="name"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                {/* Password requirements */}
                <div className="mt-3 rounded-xl bg-slate-50 p-3">

                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    Password requirements
                  </p>

                  <div className="space-y-1">

                    <p
                      className={`text-xs ${
                        formData.password.length >= 8
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      {formData.password.length >= 8
                        ? "✓"
                        : "○"}{" "}
                      At least 8 characters
                    </p>

                    <p
                      className={`text-xs ${
                        /[A-Z]/.test(
                          formData.password
                        )
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      {/[A-Z]/.test(
                        formData.password
                      )
                        ? "✓"
                        : "○"}{" "}
                      One uppercase letter
                    </p>

                    <p
                      className={`text-xs ${
                        /\d/.test(
                          formData.password
                        )
                          ? "text-green-600"
                          : "text-slate-400"
                      }`}
                    >
                      {/\d/.test(
                        formData.password
                      )
                        ? "✓"
                        : "○"}{" "}
                      One number
                    </p>

                  </div>

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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

            </form>

            <p className="mt-8 text-center text-sm text-slate-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign in
              </Link>

            </p>

          </div>

          {/* ================================= */}
          {/* BRANDING PANEL */}
          {/* ================================= */}

          <div className="order-1 hidden bg-blue-600 p-10 text-white lg:order-2 lg:flex">

            <div className="flex flex-col justify-between w-full">

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

                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                  <ShoppingBag size={40} />
                </div>

                <h2 className="text-4xl font-bold leading-tight">
                  Everything you need,
                  <span className="block text-blue-200">
                    all in one place.
                  </span>
                </h2>

                <p className="mt-5 max-w-md leading-7 text-blue-100">
                  Create your ShopFlow account and
                  discover a simple, fast, and enjoyable
                  shopping experience.
                </p>

              </div>

              <div className="space-y-2 text-sm text-blue-100">

                <p>✓ Easy product discovery</p>
                <p>✓ Simple checkout</p>
                <p>✓ Track your orders</p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;