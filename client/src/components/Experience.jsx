
import React from "react";

const Experience = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">
          Your Booking Experience
        </h1>

        <p className="mt-6 max-w-3xl text-gray-600 leading-8">
          Enjoy a straightforward way to explore hotels and
          rooms. Our platform is designed to help guests find
          accommodation and help hotel owners manage their listings.
        </p>

        <div className="grid gap-6 md:grid-cols-3 mt-10">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold">Explore Hotels</h2>
            <p className="mt-3 text-gray-600">
              Browse available hotels and room options.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold">Choose Your Room</h2>
            <p className="mt-3 text-gray-600">
              Review room details before making a booking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold">Manage Your Stay</h2>
            <p className="mt-3 text-gray-600">
              Access your bookings through your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
