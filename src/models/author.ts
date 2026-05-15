import mongoose, { Schema } from "mongoose";

const authorSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

export default mongoose.model("Author", authorSchema);
