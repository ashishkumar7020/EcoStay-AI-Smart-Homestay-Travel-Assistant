import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
      index: true
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    checkIn: {
      type: Date,
      required: true
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
      max: 365
    },
    status: {
      type: String,
      required: true,
      enum: ["confirmed", "pending", "cancelled"],
      default: "pending",
      index: true
    },
    sustainabilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

bookingSchema.index({ destination: "text" });
bookingSchema.index({ checkIn: 1 });

export default mongoose.model("Booking", bookingSchema);
