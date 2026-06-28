import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = new Set([FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"]);

      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

let nextBookingId = 5;

const bookings = [
  {
    id: 1,
    guestName: "Aarav Sharma",
    destination: "Munnar, Kerala",
    checkIn: "2026-07-04",
    nights: 3,
    status: "confirmed",
    sustainabilityScore: 92,
    totalAmount: 18400
  },
  {
    id: 2,
    guestName: "Meera Iyer",
    destination: "Coorg, Karnataka",
    checkIn: "2026-07-09",
    nights: 2,
    status: "pending",
    sustainabilityScore: 86,
    totalAmount: 12600
  },
  {
    id: 3,
    guestName: "Kabir Sen",
    destination: "Alleppey, Kerala",
    checkIn: "2026-07-12",
    nights: 4,
    status: "confirmed",
    sustainabilityScore: 95,
    totalAmount: 24800
  },
  {
    id: 4,
    guestName: "Nisha Rao",
    destination: "Ooty, Tamil Nadu",
    checkIn: "2026-07-18",
    nights: 2,
    status: "cancelled",
    sustainabilityScore: 78,
    totalAmount: 9800
  }
];

function findBooking(id) {
  return bookings.find((booking) => booking.id === Number(id));
}

function isBlank(value) {
  return typeof value === "string" && value.trim() === "";
}

function isValidDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

function validateBooking(payload, partial = false) {
  const errors = [];
  const requiredFields = ["guestName", "destination", "checkIn", "nights", "status", "sustainabilityScore", "totalAmount"];
  const allowedFields = new Set(requiredFields);

  Object.keys(payload).forEach((field) => {
    if (!allowedFields.has(field)) {
      errors.push(`${field} is not allowed`);
    }
  });

  if (!partial) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || payload[field] === null || isBlank(payload[field])) {
        errors.push(`${field} is required`);
      }
    });
  } else {
    requiredFields.forEach((field) => {
      if (payload[field] === null || isBlank(payload[field])) {
        errors.push(`${field} cannot be blank`);
      }
    });
  }

  ["guestName", "destination"].forEach((field) => {
    if (payload[field] !== undefined && (typeof payload[field] !== "string" || isBlank(payload[field]))) {
      errors.push(`${field} must be a non-empty string`);
    }
  });

  if (payload.checkIn !== undefined && !isValidDateString(payload.checkIn)) {
    errors.push("checkIn must be a valid date in YYYY-MM-DD format");
  }

  if (payload.nights !== undefined && (!Number.isInteger(Number(payload.nights)) || Number(payload.nights) < 1)) {
    errors.push("nights must be a positive integer");
  }

  if (
    payload.sustainabilityScore !== undefined &&
    (!Number.isInteger(Number(payload.sustainabilityScore)) ||
      Number(payload.sustainabilityScore) < 0 ||
      Number(payload.sustainabilityScore) > 100)
  ) {
    errors.push("sustainabilityScore must be an integer from 0 to 100");
  }

  if (payload.totalAmount !== undefined && (!Number.isFinite(Number(payload.totalAmount)) || Number(payload.totalAmount) < 0)) {
    errors.push("totalAmount must be zero or more");
  }

  if (payload.status !== undefined && !["confirmed", "pending", "cancelled"].includes(payload.status)) {
    errors.push("status must be confirmed, pending, or cancelled");
  }

  return errors;
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "EcoStay AI API" });
});

app.get("/api/bookings", (req, res) => {
  res.status(200).json({ data: bookings });
});

app.get("/api/bookings/search", (req, res) => {
  const query = String(req.query.q || "").trim().toLowerCase();

  if (!query) {
    return res.status(400).json({ error: "Search query q is required" });
  }

  const results = bookings.filter(
    (booking) =>
      booking.guestName.toLowerCase().includes(query) ||
      booking.destination.toLowerCase().includes(query) ||
      booking.status.toLowerCase().includes(query)
  );

  return res.status(200).json({ data: results });
});

app.get("/api/bookings/stats", (req, res) => {
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const averageSustainabilityScore =
    bookings.length > 0 ? bookings.reduce((sum, booking) => sum + booking.sustainabilityScore, 0) / bookings.length : 0;

  res.status(200).json({
    data: {
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      totalRevenue,
      averageSustainabilityScore: Math.round(averageSustainabilityScore)
    }
  });
});

app.get("/api/bookings/:id", (req, res) => {
  const booking = findBooking(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  return res.status(200).json({ data: booking });
});

app.post("/api/bookings", (req, res) => {
  const errors = validateBooking(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const newBooking = {
    id: nextBookingId,
    guestName: req.body.guestName.trim(),
    destination: req.body.destination.trim(),
    checkIn: req.body.checkIn,
    nights: Number(req.body.nights),
    status: req.body.status,
    sustainabilityScore: Number(req.body.sustainabilityScore),
    totalAmount: Number(req.body.totalAmount)
  };

  nextBookingId += 1;
  bookings.push(newBooking);

  return res.status(201).json({ data: newBooking });
});

app.put("/api/bookings/:id", (req, res) => {
  const booking = findBooking(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const errors = validateBooking(req.body, true);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  Object.assign(booking, {
    ...req.body,
    guestName: req.body.guestName !== undefined ? req.body.guestName.trim() : booking.guestName,
    destination: req.body.destination !== undefined ? req.body.destination.trim() : booking.destination,
    nights: req.body.nights !== undefined ? Number(req.body.nights) : booking.nights,
    sustainabilityScore:
      req.body.sustainabilityScore !== undefined ? Number(req.body.sustainabilityScore) : booking.sustainabilityScore,
    totalAmount: req.body.totalAmount !== undefined ? Number(req.body.totalAmount) : booking.totalAmount
  });

  return res.status(200).json({ data: booking });
});

app.delete("/api/bookings/:id", (req, res) => {
  const bookingIndex = bookings.findIndex((booking) => booking.id === Number(req.params.id));

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  bookings.splice(bookingIndex, 1);
  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`EcoStay AI API running on http://localhost:${PORT}`);
});
