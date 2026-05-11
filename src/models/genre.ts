import mongoose, { Schema } from "mongoose";

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Genre", genreSchema);
