
import Hotel from "../models/Hotel.js";

// Register hotel
export const registerHotel = async (req, res) => {
  try {
    console.log("Hotel request body:", req.body);

    const { name, address, contact, city } = req.body || {};

    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide all hotel details",
      });
    }

    const owner = req.user.id;

    const hotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
    });

    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
      hotel,
    });
  } catch (error) {
    console.error("Register hotel error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register hotel",
    });
  }
};
