import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("❌ No token provided in Authorization header");
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production");
    
    if (!decoded) {
      console.error("❌ Failed to decode token");
      return res.status(401).json({ message: "Invalid token format" });
    }

    
    // Extract user information from our JWT
    // Our tokens have 'id' and 'email' fields
    if (decoded && decoded.id) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      return next();
    }

    console.error("❌ Token missing required fields (id or email)");
    console.error("Payload:", decoded);
    return res.status(401).json({ message: "Invalid token: missing user ID or email" });
  } catch (err) {
    console.error("❌ Authentication error:", err.message);
    console.error("Stack:", err.stack);
    return res.status(401).json({ message: "Invalid or malformed token" });
  }
};

export const authorizeSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Only sellers can perform this action" });
  }
  next();
};
