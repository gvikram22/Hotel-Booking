
import express from "express";

import {
  protect,
  authorizeHotelOwner,
} from "../middleware/authMiddleware.js";

import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
  deleteRoom,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

// Create a room
roomRouter.post(
  "/",
  protect,
  authorizeHotelOwner,
  createRoom
);

// Public: Get available rooms
roomRouter.get("/", getRooms);

// Owner: Get their rooms
roomRouter.get(
  "/owner",
  protect,
  authorizeHotelOwner,
  getOwnerRooms
);

// Owner: Toggle room availability
roomRouter.post(
  "/toggle-availability",
  protect,
  authorizeHotelOwner,
  toggleRoomAvailability
);

// Owner: Delete a room
roomRouter.delete(
  "/:roomId",
  protect,
  authorizeHotelOwner,
  deleteRoom
);

export default roomRouter;
