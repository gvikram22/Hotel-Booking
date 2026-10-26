
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

// Create a room and save images in MongoDB
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities, images } = req.body;

    if (typeof roomType !== "string" || !roomType.trim()) {
      return res.status(400).json({
        success: false,
        message: "Room type is required",
      });
    }

    if (
      pricePerNight === undefined ||
      pricePerNight === "" ||
      !Number.isFinite(Number(pricePerNight)) ||
      Number(pricePerNight) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid price per night",
      });
    }

    let parsedAmenities = amenities ?? [];

    if (typeof parsedAmenities === "string") {
      try {
        parsedAmenities = JSON.parse(parsedAmenities);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Amenities must be a valid array",
        });
      }
    }

    if (
      !Array.isArray(parsedAmenities) ||
      !parsedAmenities.every((item) => typeof item === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Amenities must be an array of strings",
      });
    }

    const parsedImages = images ?? [];

    if (
      !Array.isArray(parsedImages) ||
      parsedImages.length > 4 ||
      !parsedImages.every(
        (image) =>
          typeof image === "string" &&
          /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(image)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide up to 4 valid Base64 images",
      });
    }

    const hotel = await Hotel.findOne({ owner: req.user.id });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found for this owner. Please register your hotel first.",
      });
    }

    const room = await Room.create({
      hotel: hotel._id,
      roomType: roomType.trim(),
      pricePerNight: Number(pricePerNight),
      amenities: parsedAmenities,
      images: parsedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      hotelName: hotel.name,
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
};

// Get all available rooms for the public website.
// Exclude rooms whose hotel no longer exists.
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate("hotel")
      .sort({ createdAt: -1 });

    const validRooms = rooms.filter((room) => room.hotel !== null);

    return res.status(200).json({
      success: true,
      rooms: validRooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// Get all rooms belonging to the logged-in owner
export const getOwnerRooms = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.id });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found for this owner. Please register your hotel first.",
      });
    }

    const rooms = await Room.find({ hotel: hotel._id })
      .populate("hotel")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      hotelName: hotel.name,
      rooms,
    });
  } catch (error) {
    console.error("Get owner rooms error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner rooms",
    });
  }
};

// Toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId || !/^[a-f\d]{24}$/i.test(roomId)) {
      return res.status(400).json({
        success: false,
        message: "A valid room ID is required",
      });
    }

    const hotel = await Hotel.findOne({ owner: req.user.id });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found for this owner",
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      hotel: hotel._id,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or access denied",
      });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room availability updated successfully",
      isAvailable: room.isAvailable,
      room,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update room availability",
    });
  }
};

// Delete a room owned by the logged-in hotel owner
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId || !/^[a-f\d]{24}$/i.test(roomId)) {
      return res.status(400).json({
        success: false,
        message: "A valid room ID is required",
      });
    }

    const hotel = await Hotel.findOne({ owner: req.user.id });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found for this owner",
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      hotel: hotel._id,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or access denied",
      });
    }

    // Protect existing booking records.
    const existingBooking = await Booking.exists({
      room: room._id,
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "This room has bookings. Resolve its bookings before deleting it.",
      });
    }

    await room.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      roomId,
    });
  } catch (error) {
    console.error("Delete room error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete room",
    });
  }
};
