
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// 1. Check room availability
const checkAvailability = async ({
    checkInDate,
    checkOutDate,
    room
}) => {
    const bookings = await Booking.find({
        room,
        status: { $ne: "cancelled" },
        checkInDate: { $lt: new Date(checkOutDate) },
        checkOutDate: { $gt: new Date(checkInDate) }
    });

    return bookings.length === 0;
};

// 2. Check availability API
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;

        if (!room || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Room and dates are required"
            });
        }

        const isAvailable = await checkAvailability({
            room,
            checkInDate,
            checkOutDate
        });

        return res.json({
            success: true,
            isAvailable
        });
    } catch (error) {
        console.error("Availability error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 3. Create booking
export const createBooking = async (req, res) => {
    try {
        const {
            room,
            checkInDate,
            checkOutDate,
            guests,
            paymentMethod
        } = req.body;

        if (!room || !checkInDate || !checkOutDate || !guests) {
            return res.status(400).json({
                success: false,
                message: "Please provide all booking details"
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (
            Number.isNaN(checkIn.getTime()) ||
            Number.isNaN(checkOut.getTime()) ||
            checkOut <= checkIn ||
            Number(guests) < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking dates or guest count"
            });
        }

        const roomData = await Room.findById(room).populate("hotel");

        if (!roomData || !roomData.hotel) {
            return res.status(404).json({
                success: false,
                message: "Room or hotel not found"
            });
        }

        const isAvailable = await checkAvailability({
            room,
            checkInDate: checkIn,
            checkOutDate: checkOut
        });

        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: "Room is not available for these dates"
            });
        }

        const nights = Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const totalPrice = roomData.pricePerNight * nights;

        const booking = await Booking.create({
            user: req.user.id,
            room,
            hotel: roomData.hotel._id,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guests: Number(guests),
            totalPrice,
            paymentMethod: paymentMethod || "Pay At Hotel",
            status: "confirmed"
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 4. Get bookings for logged-in user
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id
        })
            .populate("room hotel")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error("User bookings error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
};

// 5. Cancel user's own booking
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId || !/^[a-f\d]{24}$/i.test(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        const booking = await Booking.findOne({
            _id: bookingId,
            user: req.user.id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or unauthorized"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        return res.json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        console.error("Cancel booking error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to cancel booking"
        });
    }
};

// 6. Get all bookings for every hotel owned by this owner
export const getHotelBookings = async (req, res) => {
    try {
        const hotels = await Hotel.find({
            owner: req.user.id
        }).select("_id");

        const hotelIds = hotels.map(hotel => hotel._id);

        const bookings = await Booking.find({
            hotel: { $in: hotelIds }
        })
            .populate("room hotel user")
            .sort({ createdAt: -1 });

        const activeBookings = bookings.filter(
            booking => booking.status !== "cancelled"
        );

        const totalBookings = activeBookings.length;

        const totalRevenue = activeBookings.reduce(
            (total, booking) => total + booking.totalPrice,
            0
        );

        return res.json({
            success: true,
            dashboardData: {
                totalBookings,
                totalRevenue,
                bookings
            }
        });
    } catch (error) {
        console.error("Hotel bookings error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotel bookings"
        });
    }
};
