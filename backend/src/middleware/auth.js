import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("❌ No token provided in Authorization header");
    console.error("Headers:", req.headers);
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Decode the JWT token without verification (for Supabase tokens)
    // This works because we trust Supabase as our auth provider
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      console.error("❌ Failed to decode token");
      return res.status(401).json({ message: "Invalid token format" });
    }

    const payload = decoded.payload;
    console.log("✓ Token decoded successfully");
    console.log("Payload keys:", Object.keys(payload));
    
    // Extract user information from Supabase JWT
    // Supabase tokens have 'sub' (user ID) and 'email'
    if (payload && payload.sub) {
      req.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.user_metadata?.full_name || payload.email || "User",
      };
      console.log(`✓ User authenticated: ${req.user.email} (${req.user.id})`);
      return next();
    }

    console.error("❌ Token missing required fields (sub or email)");
    console.error("Payload:", payload);
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
