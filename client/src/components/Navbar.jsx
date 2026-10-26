
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/experience" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Update Navbar when login/logout happens
  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("auth-change", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("auth-change", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  // Handle navbar background on scroll
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const isHotelOwner = user?.role === "hotelOwner";

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled ? "invert opacity-80" : ""}`}
        />
      </Link>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}

        {user && isHotelOwner && (
          <button
            onClick={() => navigate("/owner")}
            className={`border px-4 py-1 text-sm rounded-full ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            Dashboard
          </button>
        )}

        {user && !isHotelOwner && (
          <button
            onClick={() => navigate("/my-bookings")}
            className={`border px-4 py-1 text-sm rounded-full ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            My Bookings
          </button>
        )}
      </div>

      {/* Desktop right section */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`h-7 ${isScrolled ? "invert" : ""}`}
        />

        {user ? (
          <>
            <span className={isScrolled ? "text-gray-700" : "text-white"}>
              Hi, {user.username || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-full bg-black text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="px-8 py-2.5 rounded-full bg-black text-white"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          src={assets.menuIcon}
          alt="menu"
          onClick={() => setIsMenuOpen(true)}
          className={`h-5 cursor-pointer ${isScrolled ? "invert" : ""}`}
        />
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close-menu" className="h-6" />
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {user && isHotelOwner && (
          <button
            onClick={() => {
              navigate("/owner");
              setIsMenuOpen(false);
            }}
          >
            Dashboard
          </button>
        )}

        {user && !isHotelOwner && (
          <button
            onClick={() => {
              navigate("/my-bookings");
              setIsMenuOpen(false);
            }}
          >
            My Bookings
          </button>
        )}

        {user ? (
          <>
            <span>Hi, {user.username || "User"}</span>
            <button
              onClick={handleLogout}
              className="bg-black text-white px-8 py-2.5 rounded-full"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-black text-white px-8 py-2.5 rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
