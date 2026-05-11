// import app from './app';
import express from "express";
import dotenv from "dotenv";
import userRoutes from "@/routes/userRoutes";
import authRoutes from "@/routes/authRoutes";
import genreRoutes from "@/routes/genreRoutes";
import bookRoutes from "@/routes/bookRoutes";
import mongoose from "mongoose";
import { logger } from "./middlewares/logger";
import { protect } from "@/middlewares/auth";
import { isAuthor } from "@/middlewares/author";
import { getHello } from "./controllers/userController";
import authorRoutes from "./routes/authorRoutes";


dotenv.config();

const app = express();

const PORT: number = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(logger);

app.get("/hello", getHello);

app.use("/auth", authRoutes)
app.use("/api/users", protect, userRoutes);
app.use("/api/genre", protect, genreRoutes);
app.use("/api/book", protect, bookRoutes);
app.use("/api/author", protect, authorRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
