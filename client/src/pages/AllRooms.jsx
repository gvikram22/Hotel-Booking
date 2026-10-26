import React, { useEffect, useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllRooms = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/rooms");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch rooms");
        }

        setRooms(data.rooms || []);
      } catch (err) {
        setError(err.message || "Unable to connect to the backend");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  const openRoom = (id) => {
    navigate(`/rooms/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-8">
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col items-start text-left mb-8">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-2xl">
            Take advantage of our limited-time offers and special packages
            to enhance your stay and create unforgettable memories.
          </p>
        </div>

        {loading && <p>Loading rooms...</p>}
        {!loading && error && <p className="text-red-500">{error}</p>}
        {!loading && !error && rooms.length === 0 && (
          <p>No available rooms found in the database.</p>
        )}

        {!loading && !error && rooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-8 mb-8"
          >
            {room.images?.[0] ? (
              <img
                onClick={() => openRoom(room._id)}
                src={room.images[0]}
                alt={room.roomType}
                className="w-full md:w-1/2 h-65 rounded-xl shadow-lg object-cover cursor-pointer"
              />
            ) : (
              <div
                onClick={() => openRoom(room._id)}
                className="w-full md:w-1/2 h-65 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer text-gray-500"
              >
                Room image unavailable
              </div>
            )}

            <div className="md:w-1/2 flex flex-col gap-2">
              <p
                onClick={() => openRoom(room._id)}
                className="text-gray-500 cursor-pointer"
              >
                {room.hotel?.city || "Location unavailable"}
              </p>

              <p
                onClick={() => openRoom(room._id)}
                className="text-gray-700 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel?.name || "Hotel"}
              </p>

              <p className="text-gray-600">{room.roomType}</p>

              <div className="flex items-center">
                <StarRating />
                <p className="ml-2 text-sm text-gray-500">Guest reviews</p>
              </div>

              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img
                  src={assets.locationIcon}
                  alt="location"
                  className="w-4 h-4"
                />
                <span>{room.hotel?.address || "Address unavailable"}</span>
              </div>

              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {(room.amenities || []).map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5F5]"
                  >
                    {facilityIcons[item] && (
                      <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                    )}
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-xl font-medium text-gray-700">
                ₹{room.pricePerNight}/night
              </p>

              <button
                onClick={() => openRoom(room._id)}
                className="mt-3 bg-primary text-white rounded-md px-5 py-2 w-fit"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white w-full lg:w-80 border border-gray-300 text-gray-600 lg:mt-16">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-300">
          <p className="text-base font-medium text-gray-800">Filter</p>
          <span
            onClick={() => setOpenFilters(!openFilters)}
            className="lg:hidden cursor-pointer text-sm"
          >
            {openFilters ? "HIDE" : "SHOW"}
          </span>
          <span className="hidden lg:block text-sm">CLEAR</span>
        </div>

        <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            {roomTypes.map((item) => <CheckBox key={item} label={item} />)}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((item) => <CheckBox key={item} label={`₹ ${item}`} />)}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((item) => <RadioButton key={item} label={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;