
import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const HotelReg = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "hotelOwner") {
      setError(
        "Your account is not registered as a hotel owner. Please use a hotel owner account."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Hotel registration failed.");
      }

      setSuccess("Hotel registered successfully!");

      setFormData({
        name: "",
        contact: "",
        address: "",
        city: "",
      });

      setTimeout(() => {
        navigate("/owner");
      }, 1000);
    } catch (err) {
      setError(err.message || "Unable to register your hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-4xl overflow-hidden rounded-xl bg-white"
      >
        <img
          src={assets.regImage}
          alt="Hotel registration"
          className="hidden w-1/2 object-cover md:block"
        />

        <div className="relative w-full p-6 md:w-1/2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-4 top-4 text-xl text-gray-500 hover:text-black"
            aria-label="Close hotel registration"
          >
            &times;
          </button>

          <h1 className="mt-3 text-2xl font-semibold">
            Register Your Hotel
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your hotel details below.
          </p>

          {error && (
            <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          <div className="mt-4">
            <label htmlFor="name" className="font-medium text-gray-600">
              Hotel Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter hotel name"
              className="mt-1 w-full rounded border border-gray-200 px-3 py-2.5 outline-indigo-500"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="contact" className="font-medium text-gray-600">
              Phone
            </label>
            <input
              id="contact"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="mt-1 w-full rounded border border-gray-200 px-3 py-2.5 outline-indigo-500"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="font-medium text-gray-600">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter hotel address"
              className="mt-1 w-full rounded border border-gray-200 px-3 py-2.5 outline-indigo-500"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="city" className="font-medium text-gray-600">
              City
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-200 px-3 py-2.5 outline-indigo-500"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded bg-indigo-500 px-6 py-2.5 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
