
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomType: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 1,
    },

    amenities: {
      type: [String],
      default: [],
    },

    // Base64 image strings stored directly in MongoDB
    images: {
      type: [String],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
