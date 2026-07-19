import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120
    },
    passwordHash: {
      type: String,
      select: false
    },
    provider: {
      type: String,
      enum: ["local", "github"],
      default: "local"
    },
    providerId: {
      type: String,
      index: true
    },
    name: {
      type: String,
      trim: true,
      maxlength: 80
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
