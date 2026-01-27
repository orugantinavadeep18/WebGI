import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

let supabase = null;

const getSupabaseClient = () => {
  if (supabase) return supabase;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not configured. Supabase token validation will be skipped.");
    return null;
  }
  
  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Try to verify with JWT_SECRET first (for backward compatibility)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (jwtErr) {
      // JWT verification failed, try Supabase
    }

    // Try Supabase token verification if Supabase is initialized
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      console.error("Supabase not initialized - missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
      return res.status(500).json({ message: "Authentication service not configured" });
    }

    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Set user info from Supabase
    req.user = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email,
    };

    next();
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
