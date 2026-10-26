
import React, { useState, useEffect, useCallback } from "react";
import Title from "../components/Title";

const API_URL = "http://localhost:3000/api/bookings";
const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // Fetch bookings for the logged-in user
    const fetchBookings = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please log in to view your bookings.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                throw new Error("Session expired. Please log in again.");
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to load bookings.");
            }

            setBookings(data.bookings || []);
        } catch (err) {
            console.error("Fetch bookings error:", err);
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Cancel a booking
    const handleCancelBooking = async (bookingId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please log in to cancel your booking.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setCancellingId(bookingId);
            setError("");
            setSuccess("");

            const response = await fetch(`${API_URL}/${bookingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const contentType = response.headers.get("content-type") || "";
            let data = {};

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const responseText = await response.text();
                throw new Error(
                    `Server returned HTTP ${response.status}. ${
                        responseText.slice(0, 150) ||
                        "Check your DELETE endpoint."
                    }`
                );
            }

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                throw new Error("Session expired. Please log in again.");
            }

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || `Cancellation failed (${response.status}).`
                );
            }

            // Immediately update the existing booking card
            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: "cancelled" }
                        : booking
                )
            );

            setSuccess(data.message || "Booking cancelled successfully.");
        } catch (err) {
            console.error("Cancellation failed:", err);
            setError(err.message || "Unable to cancel booking.");
        } finally {
            setCancellingId(null);
        }
    };

    // Format dates
    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <p>Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-10 md:px-10">
            <Title
                title="My Bookings"
                subTitle="View and manage all your hotel reservations."
                align="left"
            />

            {error && (
                <div
                    role="alert"
                    className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700"
                >
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={fetchBookings}
                        className="mt-2 font-semibold underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {success && (
                <div
                    role="status"
                    className="mt-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700"
                >
                    {success}
                </div>
            )}

            {!error && bookings.length === 0 && (
                <div className="mt-10 rounded-xl border p-8 text-center">
                    <h3 className="text-lg font-semibold">
                        No bookings found
                    </h3>
                    <p className="mt-2 text-gray-500">
                        You haven't made any hotel bookings yet.
                    </p>
                </div>
            )}

            <div className="mt-8 space-y-6">
                {bookings.map((booking) => {
                    const hotel = booking.hotel || {};
                    const room = booking.room || {};
                    const isCancelled =
                        String(booking.status || "").toLowerCase() ===
                        "cancelled";
                    const isCancelling = cancellingId === booking._id;

                    const hotelName =
                        hotel.name ||
                        hotel.hotelName ||
                        "Hotel details unavailable";

                    const roomName =
                        room.roomType || room.name || room.type || "Room";

                    const image =
                        hotel.images?.[0] ||
                        room.images?.[0] ||
                        room.image;

                    return (
                        <div
                            key={booking._id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="flex flex-col gap-5 p-5 md:flex-row md:p-6">
                                <div className="h-48 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-40 md:w-52">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={hotelName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {hotelName}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {roomName}
                                            </p>
                                            {hotel.address && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {hotel.address}
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                                                isCancelled
                                                    ? "bg-red-100 text-red-700"
                                                    : String(
                                                          booking.status || ""
                                                      ).toLowerCase() ===
                                                      "confirmed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {isCancelled
                                                ? "Cancelled"
                                                : booking.status || "Pending"}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Check-in
                                            </p>
                                            <p className="font-medium">
                                                {formatDate(
                                                    booking.checkInDate
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Check-out
                                            </p>
                                            <p className="font-medium">
                                                {formatDate(
                                                    booking.checkOutDate
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Guests
                                            </p>
                                            <p className="font-medium">
                                                {booking.guests ?? "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total price
                                            </p>
                                            <p className="font-semibold">
                                                ₹
                                                {Number(
                                                    booking.totalPrice || 0
                                                ).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Payment method
                                            </p>
                                            <p className="font-medium">
                                                {booking.paymentMethod ||
                                                    "Pay At Hotel"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Payment status
                                            </p>
                                            <p className="font-medium">
                                                {booking.isPaid
                                                    ? "Paid"
                                                    : "Not paid"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        {!isCancelled ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCancelBooking(
                                                        booking._id
                                                    )
                                                }
                                                disabled={isCancelling}
                                                className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isCancelling
                                                    ? "Cancelling..."
                                                    : "Cancel Booking"}
                                            </button>
                                        ) : (
                                            <p className="font-medium text-red-600">
                                                This booking has been cancelled.
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400">
                                            Booking ID: {booking._id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyBookings;