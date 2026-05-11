import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    token: {
      type: String,
    },
    expiresIn: {
      type: Date,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Token", tokenSchema);