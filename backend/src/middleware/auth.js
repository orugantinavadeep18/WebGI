import jwt from "jsonwebtoken";

// Extract the public key from a JWT (Supabase tokens)
const getSupabasePublicKey = () => {
  // Supabase uses RS256, so we need the public key from the JWT header
  // For now, we'll try both JWT_SECRET (HS256) and RSA public key verification
  return process.env.SUPABASE_JWT_SECRET || null;
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Try to verify with JWT_SECRET first (for backward compatibility with old tokens)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("✓ Token verified with JWT_SECRET (legacy)");
      return next();
    } catch (jwtErr) {
      console.log("- JWT_SECRET verification failed, trying Supabase JWT validation...");
      // Continue to Supabase validation
    }

    // Try to verify Supabase JWT token
    // Supabase tokens are JWTs signed with a secret key
    // We can decode and validate them
    try {
      // Decode without verification first to get claims
      const decoded = jwt.decode(token, { complete: true });
      
      if (!decoded) {
        return res.status(403).json({ message: "Invalid token format" });
      }

      // For Supabase tokens, verify the signature using the JWT secret
      const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
      
      if (!supabaseJwtSecret) {
        console.error("SUPABASE_JWT_SECRET not configured in environment");
        // If we can't verify, just use the decoded payload
        // This is less secure but allows development without the secret
        const payload = decoded.payload;
        if (payload && payload.sub) {
          req.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.user_metadata?.full_name || payload.email,
          };
          console.log("✓ Token accepted (unverified - SUPABASE_JWT_SECRET not configured)");
          return next();
        }
      } else {
        // Verify the signature
        const verified = jwt.verify(token, supabaseJwtSecret);
        req.user = {
          id: verified.sub,
          email: verified.email,
          name: verified.user_metadata?.full_name || verified.email,
        };
        console.log("✓ Token verified with SUPABASE_JWT_SECRET");
        return next();
      }

      return res.status(403).json({ message: "Invalid or expired token" });
    } catch (supabaseErr) {
      console.error("Supabase token validation error:", supabaseErr.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
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
