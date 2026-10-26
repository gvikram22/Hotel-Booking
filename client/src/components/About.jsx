
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">
          About Us
        </h1>

        <p className="mt-6 max-w-3xl text-gray-600 leading-8">
          Welcome to our Hotel Booking platform. We make it
          easy to explore hotels, discover comfortable rooms,
          and plan your next trip.
        </p>

        <div className="grid gap-6 md:grid-cols-3 mt-10">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold">Easy Booking</h2>
            <p className="mt-3 text-gray-600">
              Find suitable rooms through a simple booking experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold">Comfort</h2>
            <p className="mt-3 text-gray-600">
              Explore accommodation options for your travel needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold">Convenience</h2>
            <p className="mt-3 text-gray-600">
              Discover hotels and manage your travel plans in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
