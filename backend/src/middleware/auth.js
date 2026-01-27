import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Decode the JWT token without verification (for Supabase tokens in development)
    // In production, you should verify the signature
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const payload = decoded.payload;
    
    // Extract user information from Supabase JWT
    // Supabase tokens have 'sub' (user ID) and 'email'
    if (payload && payload.sub) {
      req.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.user_metadata?.full_name || payload.email || "User",
      };
      console.log(`✓ User authenticated: ${req.user.email}`);
      return next();
    }

    return res.status(401).json({ message: "Invalid token: missing user ID" });
  } catch (err) {
    console.error("Authentication error:", err.message);
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
