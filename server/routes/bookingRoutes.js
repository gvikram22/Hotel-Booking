
import express from "express";

import {
    checkAvailabilityAPI,
    createBooking,
    getHotelBookings,
    getUserBookings,
    cancelBooking
} from "../controllers/bookingController.js";

import {
    protect,
    authorizeHotelOwner
} from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

// Check room availability
bookingRouter.post(
    "/check-availability",
    checkAvailabilityAPI
);

// Create a booking
bookingRouter.post(
    "/book",
    protect,
    createBooking
);

// Get all bookings for the logged-in user
bookingRouter.get(
    "/user",
    protect,
    getUserBookings
);

// Cancel a booking belonging to the logged-in user
bookingRouter.delete(
    "/:bookingId",
    protect,
    cancelBooking
);

// Get all bookings for the hotel owner
bookingRouter.get(
    "/hotel",
    protect,
    authorizeHotelOwner,
    getHotelBookings
);

export default bookingRouter;
