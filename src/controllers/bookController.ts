import author from "@/models/author";
import Book from "@/models/books";
import genre from "@/models/genre";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getBookById = async (req: Request, res: Response) => {
  try {
    const books = await Book.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id as string),
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $lookup: {
          from: "books",
          localField: "author._id",
          foreignField: "author",
          as: "authorBooks",
        },
      },
      {
        $addFields: {
          authorBookCount: {
            $size: "$authorBooks",
          },
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
        $unwind: "$genres",
      },
      {
        $lookup: {
          from: "books",
          localField: "genres._id",
          foreignField: "genres",
          as: "genreBooks",
        },
      },
      {
        $addFields: {
          genreBookCount: {
            $size: "$genreBooks",
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          author: {
            username: 1,
          },
          authorBookCount: 1,
          genres: {
            name: 1,
          },
          genreBookCount: 1,
        },
      },
    ]);
    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {

    if (!req.body.title || !req.body.genres || !req.body.description || !req.body.author) {
      return res.status(400).json({ message: "Required Details Missing" });
    }
    const books = await Book.create({
      title: req.body.title,
      author: req.body.author,
      genres: req.body.genres,
      description: req.body.description,
    });
    await genre.updateMany(
      { _id: { $in: req.body.genres } },
      { $push: { books: books._id } }
    );
    await author.updateOne(
      { _id: req.body.author },
      { $push: { books: books._id } }
    );
    res.status(200).json({ message: `Book Created: `, data: books });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};

export const deleteBookById = async (req: Request, res: Response) => {
  try {
    console.log("req.params.id", req.params.id);
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }


    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Book Deleted: ${book.title}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};
