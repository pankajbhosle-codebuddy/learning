import { Request, Response } from "express";
import Author from "@/models/author";
import mongoose from "mongoose";
import author from "@/models/author";

export const createAuthor = async (req: Request, res: Response) => {
  const username: string = req.body.username;


  if (await Author.findOne({ username })) {
    return res.status(400).json({ message: "Username already exists" });
  }
  if (!username ) {
    return res.status(400).json({ message: "Required Details Missing" });
  }
  try {
    const author = await Author.create({ username});
    res.status(201).json({ message: `Author created: ${author._id}` });
  } catch (err) {
    res.status(500).json({ message: "Error creating author: " + err });
  }
};

export const getBooksByAuthor = async (req: Request, res: Response) => {
  try {
    const AllBooks = await author.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.authorId as string),
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "books",
          foreignField: "_id",
          as: "books",
        },
      },
    ]);

    res.status(200).json({ message: `Books Found:`, data: AllBooks });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};
