
import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";

import About from "./components/About";
import Experience from "./components/Experience";

import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";

import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";

const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.toLowerCase().includes("/owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}

      <div className="min-h-[70vh]">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Hotel owner registration */}
          <Route path="/hotel-register" element={<HotelReg />} />

          {/* Rooms and bookings */}
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />

          {/* Hotel owner dashboard */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-rooms" element={<ListRoom />} />
          </Route>
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;