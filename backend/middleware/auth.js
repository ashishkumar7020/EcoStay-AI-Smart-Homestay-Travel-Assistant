import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      provider: user.provider
    },
    process.env.JWT_SECRET || "development-only-jwt-secret-change-me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication token is required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "development-only-jwt-secret-change-me");
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
