
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(
        err.message || "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          Create Account
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Register to book your next stay.
        </p>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Username */}
        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium"
        >
          Username
        </label>

        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="Enter username"
        />

        {/* Email */}
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="Enter email"
        />

        {/* Password */}
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          autoComplete="new-password"
          className="mb-5 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="Create password (8+ characters)"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
