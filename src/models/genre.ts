import mongoose, { Schema } from "mongoose";

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
);

export default mongoose.model("Genre", genreSchema);
