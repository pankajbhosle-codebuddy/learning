import express from "express";
import dotenv from "dotenv";
import authorRoutes from "@/routes/authorRoutes";
import genreRoutes from "@/routes/genreRoutes";
import bookRoutes from "@/routes/bookRoutes";

dotenv.config();

const app = express();

const PORT: number = Number(process.env.PORT) || 7777;

app.use(express.json());


app.use("/api/author", authorRoutes);
app.use("/api/genre",  genreRoutes);
app.use("/api/book",  bookRoutes);


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
