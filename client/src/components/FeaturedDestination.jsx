
import React from "react";
import { roomsDummyData } from "../assets/assets";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const FeaturedDestination = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/rooms");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-slate-50 py-20 md:py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <Title
          title="Featured Destinations"
          subtitle="Discover exceptional stays, beautiful destinations, and memorable experiences for your next journey."
        />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          
{roomsDummyData.slice(0, 4).map((room, index) => (
  <div
    key={room._id || index}
    onClick={() => {
      navigate("/rooms");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="cursor-pointer transition-transform duration-300 hover:-translate-y-1"
  >
    <HotelCard room={room} index={index} />
  </div>
))}

        </div>

        <button
          onClick={handleViewAll}
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-black hover:bg-black hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          View All Hotels
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
};

export default FeaturedDestination;
