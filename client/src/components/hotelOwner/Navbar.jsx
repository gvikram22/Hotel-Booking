
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className="h-9 invert opacity-80"
        />
      </Link>

      <button
        onClick={handleLogout}
        className="rounded-full bg-black px-5 py-2 text-sm text-white transition hover:bg-gray-800"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
