import bcrypt from "bcrypt";
import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { requireAuth, signAuthToken } from "../middleware/auth.js";

const router = express.Router();
const SALT_ROUNDS = 12;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again after 15 minutes." }
});

const authValidation = [
  body("email").isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be 8 to 72 characters long")
    .matches(/[A-Za-z]/)
    .withMessage("Password must include at least one letter")
    .matches(/\d/)
    .withMessage("Password must include at least one number")
];

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array().map((error) => error.msg) });
  }
  next();
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name || "",
    provider: user.provider
  };
}

router.post("/register", authLimiter, authValidation, handleValidation, async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ error: "Email is already registered" });

    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const user = await User.create({
      email: req.body.email,
      passwordHash,
      provider: "local",
      name: req.body.name || ""
    });

    const token = signAuthToken(user);
    res.status(201).json({ token, user: serializeUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: "Email is already registered" });
    next(error);
  }
});

router.post("/login", authLimiter, authValidation, handleValidation, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+passwordHash");
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: "Invalid email or password" });

    const token = signAuthToken(user);
    res.status(200).json({ token, user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({ user: serializeUser(req.user) });
});

router.post("/logout", requireAuth, (req, res) => {
  res.status(200).json({ message: "Logged out successfully. Remove the token on the client." });
});

const githubConfigured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CALLBACK_URL);

if (githubConfigured) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"]
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const primaryEmail =
            profile.emails?.find((email) => email.primary)?.value ||
            profile.emails?.[0]?.value ||
            `${profile.username}@github.ecostay.local`;

          const user = await User.findOneAndUpdate(
            { provider: "github", providerId: profile.id },
            {
              $set: {
                email: primaryEmail.toLowerCase(),
                provider: "github",
                providerId: profile.id,
                name: profile.displayName || profile.username || "GitHub User"
              }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

router.get("/github", (req, res, next) => {
  if (!githubConfigured) return res.status(501).json({ error: "GitHub OAuth is not configured on this server" });
  passport.authenticate("github", { session: false })(req, res, next);
});

router.get("/github/callback", (req, res, next) => {
  if (!githubConfigured) return res.status(501).json({ error: "GitHub OAuth is not configured on this server" });
  passport.authenticate("github", { session: false }, (error, user) => {
    if (error || !user) {
      const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?oauth=failed`;
      return res.redirect(loginUrl);
    }

    const token = signAuthToken(user);
    const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth/callback?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  })(req, res, next);
});

export { authLimiter };
export default router;
