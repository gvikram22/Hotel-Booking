
import React from "react";
import Navbar from "../../components/hotelOwner/NavBar";
import Sidebar from "../../components/hotelOwner/Sidebar";
import { Outlet, Navigate } from "react-router-dom";

const Layout = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "hotelOwner") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;