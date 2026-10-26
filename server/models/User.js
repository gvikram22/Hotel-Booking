import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },

    recentSearchedCities: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;