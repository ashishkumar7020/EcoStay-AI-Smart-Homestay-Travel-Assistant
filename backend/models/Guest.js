import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    }
  },
  { timestamps: true }
);

guestSchema.index({ name: 1 });

export default mongoose.model("Guest", guestSchema);
