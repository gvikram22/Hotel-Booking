
import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

import { protect } from "./middleware/authMiddleware.js";
import { cancelBooking } from "./controllers/bookingController.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

connectDB();

app.get("/", (req, res) => {
    res.send("API is working fine");
});

// Direct cancellation endpoint
app.delete(
    "/api/bookings/:bookingId",
    protect,
    cancelBooking
);

// Other API routes
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Cancellation endpoint: DELETE /api/bookings/:bookingId");
});
