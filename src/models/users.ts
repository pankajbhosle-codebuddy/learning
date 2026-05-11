import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  isAuthor: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    isAuthor: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  // only hash if password changed
  if (!this.isModified("password")) {
    return;
  }

  // generate salt
  const salt = await bcrypt.genSalt(10);

  // hash password
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
