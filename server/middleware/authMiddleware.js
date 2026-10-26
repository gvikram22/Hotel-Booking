import jwt from "jsonwebtoken";

// Verify JWT access token
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
};

// Allow only hotel owners
export const authorizeHotelOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "hotelOwner") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Hotel owner permission required.",
    });
  }

  next();
};