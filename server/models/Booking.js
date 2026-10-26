
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            ref: "User",
            required: true,
        },

        room: {
            type: String,
            ref: "Room",
            required: true,
        },

        hotel: {
            type: String,
            ref: "Hotel",
            required: true,
        },

        checkInDate: {
            type: Date,
            required: true,
        },

        checkOutDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.checkInDate;
                },
                message: "Check-out date must be after check-in date",
            },
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        guests: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },

        paymentMethod: {
            type: String,
            required: true,
            default: "Pay At Hotel",
        },

        isPaid: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
