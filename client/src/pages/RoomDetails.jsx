import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { facilityIcons } from "../assets/assets";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      setRoomLoading(true);
      setRoomError("");
      setRoom(null);

      try {
        const response = await fetch("http://localhost:3000/api/rooms");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch rooms");
        }

        const foundRoom = (data.rooms || []).find(
          (item) => item._id === id
        );

        if (!foundRoom) {
          setRoomError("Room not found or no longer available.");
          return;
        }

        setRoom(foundRoom);
      } catch (error) {
        setRoomError(error.message || "Unable to connect to the backend");
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!room || !checkInDate || !checkOutDate || Number(guests) < 1) {
      alert("Please enter valid booking details");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert("Check-out must be after check-in");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/bookings/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            room: room._id,
            checkInDate,
            checkOutDate,
            guests: Number(guests),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Booking failed");
        return;
      }

      alert("Booking successful!");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Unable to connect to the backend");
    } finally {
      setLoading(false);
    }
  };

  if (roomLoading) {
    return <p className="pt-28 px-4">Loading room details...</p>;
  }

  if (roomError || !room) {
    return (
      <div className="pt-28 px-4">
        <p className="text-red-500">{roomError || "Room not found"}</p>
        <button onClick={() => navigate("/rooms")} className="mt-4 underline">
          Back to rooms
        </button>
      </div>
    );
  }

  return (
    <div className="py-28 px-4 md:px-16 lg:px-24">
      <h1 className="text-3xl font-bold">
        {room.hotel?.name || "Hotel"}
      </h1>

      <p className="text-gray-500 mt-2">
        {room.hotel?.address || room.hotel?.city || ""}
      </p>

      {room.images?.[0] ? (
        <img
          src={room.images[0]}
          alt={room.roomType}
          className="w-full max-w-xl h-80 object-cover rounded-xl my-5"
        />
      ) : (
        <div className="w-full max-w-xl h-80 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 my-5">
          Room image unavailable
        </div>
      )}

      <h2 className="text-xl mb-3">
        {room.roomType} — ₹{room.pricePerNight}/night
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {(room.amenities || []).map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2"
          >
            {facilityIcons[item] && (
              <img src={facilityIcons[item]} alt="" className="w-5 h-5" />
            )}
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleBooking}
        className="flex flex-wrap items-end gap-4 bg-white shadow-lg p-6 rounded-xl"
      >
        <div>
          <label htmlFor="checkInDate">Check-in</label>
          <input
            id="checkInDate"
            type="date"
            value={checkInDate}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
            className="block border rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="checkOutDate">Check-out</label>
          <input
            id="checkOutDate"
            type="date"
            value={checkOutDate}
            min={checkInDate || new Date().toLocaleDateString("en-CA")}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
            className="block border rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            required
            className="block border rounded px-3 py-2 w-24"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded-md px-6 py-3 disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>
    </div>
  );
};

export default RoomDetail;