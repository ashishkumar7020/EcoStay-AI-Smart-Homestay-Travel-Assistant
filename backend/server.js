import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { connectDatabase } from "./config/db.js";
import { requireAuth } from "./middleware/auth.js";
import Booking from "./models/Booking.js";
import Guest from "./models/Guest.js";
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
allowedOrigins.add("http://localhost:5173");
allowedOrigins.add("http://127.0.0.1:5173");

app.use(
  cors({
    origin(origin, callback) {
      callback(!origin || allowedOrigins.has(origin) ? null : new Error("Not allowed by CORS"), true);
    }
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

const requiredFields = ["guestName", "destination", "checkIn", "nights", "status", "sustainabilityScore", "totalAmount"];
const allowedFields = new Set(requiredFields);

function isValidDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateBooking(payload, partial = false) {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return ["Request body must be a JSON object"];
  Object.keys(payload).forEach((field) => {
    if (!allowedFields.has(field)) errors.push(`${field} is not allowed`);
  });
  if (!partial) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || payload[field] === null || payload[field] === "") errors.push(`${field} is required`);
    });
  }
  if (payload.guestName !== undefined && (typeof payload.guestName !== "string" || payload.guestName.trim().length < 2)) {
    errors.push("guestName must contain at least 2 characters");
  }
  if (payload.destination !== undefined && (typeof payload.destination !== "string" || payload.destination.trim().length < 2)) {
    errors.push("destination must contain at least 2 characters");
  }
  if (payload.checkIn !== undefined && !isValidDateString(payload.checkIn)) errors.push("checkIn must be a valid YYYY-MM-DD date");
  if (payload.nights !== undefined && (!Number.isInteger(Number(payload.nights)) || Number(payload.nights) < 1 || Number(payload.nights) > 365)) {
    errors.push("nights must be an integer from 1 to 365");
  }
  if (payload.status !== undefined && !["confirmed", "pending", "cancelled"].includes(payload.status)) {
    errors.push("status must be confirmed, pending, or cancelled");
  }
  if (payload.sustainabilityScore !== undefined && (!Number.isInteger(Number(payload.sustainabilityScore)) || Number(payload.sustainabilityScore) < 0 || Number(payload.sustainabilityScore) > 100)) {
    errors.push("sustainabilityScore must be an integer from 0 to 100");
  }
  if (payload.totalAmount !== undefined && (!Number.isFinite(Number(payload.totalAmount)) || Number(payload.totalAmount) < 0)) {
    errors.push("totalAmount must be zero or more");
  }
  return errors;
}

function serializeBooking(booking) {
  return {
    id: booking._id.toString(),
    guestName: booking.guest.name,
    destination: booking.destination,
    checkIn: booking.checkIn.toISOString().slice(0, 10),
    nights: booking.nights,
    status: booking.status,
    sustainabilityScore: booking.sustainabilityScore,
    totalAmount: booking.totalAmount,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt
  };
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function findOrCreateGuest(name) {
  const normalizedName = name.trim();
  return Guest.findOneAndUpdate(
    { name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
    { $setOnInsert: { name: normalizedName } },
    { new: true, upsert: true }
  );
}

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? "ok" : "unavailable", service: "EcoStay AI API", database: connected ? "connected" : "disconnected" });
});

app.get("/api/bookings", requireAuth, asyncRoute(async (req, res) => {
  const bookings = await Booking.find().populate("guest").sort({ createdAt: -1 });
  res.status(200).json({ data: bookings.map(serializeBooking) });
}));

app.get("/api/bookings/search", requireAuth, asyncRoute(async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (query.length < 2) return res.status(400).json({ error: "Search query q must contain at least 2 characters" });

  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const guests = await Guest.find({ name: regex }).select("_id");
  const bookings = await Booking.find({
    $or: [{ destination: regex }, { status: regex }, { guest: { $in: guests.map((guest) => guest._id) } }]
  }).populate("guest").sort({ createdAt: -1 });
  res.status(200).json({ data: bookings.map(serializeBooking) });
}));

app.get("/api/bookings/stats", requireAuth, asyncRoute(async (req, res) => {
  const [stats] = await Booking.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        confirmedBookings: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
        totalRevenue: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, "$totalAmount", 0] } },
        averageSustainabilityScore: { $avg: "$sustainabilityScore" }
      }
    }
  ]);
  res.status(200).json({
    data: stats
      ? { ...stats, _id: undefined, averageSustainabilityScore: Math.round(stats.averageSustainabilityScore) }
      : { totalBookings: 0, confirmedBookings: 0, totalRevenue: 0, averageSustainabilityScore: 0 }
  });
}));

app.get("/api/bookings/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid booking id" });
  const booking = await Booking.findById(req.params.id).populate("guest");
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.status(200).json({ data: serializeBooking(booking) });
}));

app.post("/api/bookings", requireAuth, asyncRoute(async (req, res) => {
  const errors = validateBooking(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const guest = await findOrCreateGuest(req.body.guestName);
  const booking = await Booking.create({
    guest: guest._id,
    destination: req.body.destination.trim(),
    checkIn: new Date(`${req.body.checkIn}T00:00:00.000Z`),
    nights: Number(req.body.nights),
    status: req.body.status,
    sustainabilityScore: Number(req.body.sustainabilityScore),
    totalAmount: Number(req.body.totalAmount)
  });
  await booking.populate("guest");
  res.status(201).json({ data: serializeBooking(booking) });
}));

app.put("/api/bookings/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid booking id" });
  const errors = validateBooking(req.body, true);
  if (errors.length) return res.status(400).json({ errors });
  const updates = { ...req.body };
  if (updates.guestName !== undefined) {
    const guest = await findOrCreateGuest(updates.guestName);
    updates.guest = guest._id;
    delete updates.guestName;
  }
  if (updates.destination !== undefined) updates.destination = updates.destination.trim();
  if (updates.checkIn !== undefined) updates.checkIn = new Date(`${updates.checkIn}T00:00:00.000Z`);
  ["nights", "sustainabilityScore", "totalAmount"].forEach((field) => {
    if (updates[field] !== undefined) updates[field] = Number(updates[field]);
  });
  const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate("guest");
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.status(200).json({ data: serializeBooking(booking) });
}));

app.delete("/api/bookings/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid booking id" });
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.status(204).send();
}));

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof mongoose.Error.ValidationError) return res.status(400).json({ error: err.message });
  if (err.message === "Not allowed by CORS") return res.status(403).json({ error: err.message });
  if (err.status) return res.status(err.status).json({ error: err.message });
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => console.log(`EcoStay AI API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
