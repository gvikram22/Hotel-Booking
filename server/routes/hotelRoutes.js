import express from "express";
import {
  protect,
  authorizeHotelOwner,
} from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post( "/",protect,authorizeHotelOwner,registerHotel);

export default hotelRouter;