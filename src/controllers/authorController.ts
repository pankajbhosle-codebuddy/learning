import { AuthRequest } from "@/middlewares/auth";
import Book from "@/models/books";
import { Response } from "express";
import mongoose from "mongoose";


export const getBooksByAuthor = async (req: AuthRequest, res: Response) => {
    try {
      
    const books = await Book.aggregate([
      {
        $match: {
          author:new mongoose.Types.ObjectId(req.params.authorId as string),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "genres",
          foreignField: "_id",
          as: "genres",
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          author: {
            username: 1,
          },
          genres: {
            name: 1,
          },
        },
      },
    ]);

    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).send("Server error" + error);
  }
};
