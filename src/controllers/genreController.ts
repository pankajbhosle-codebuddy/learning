import Genre from "@/models/genre";
import { Request, Response } from "express";
import mongoose from "mongoose";


export const createGenre = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Required Details Missing" });
    }
    if (await Genre.findOne({name:req.body.name})) {
      return res.status(400).json({ message: "Genre Already Exists!" });
    }
    const genres = await Genre.create({ name: req.body.name });
    res.status(200).json({ message: `Genre Created: ${genres}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};

export const getBooksByGenre = async (req: Request, res: Response) => {
    try {
      
    const books = await Genre.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.genreId as string),
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

    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};