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
          // authorBooks: 1,
          genres: {
            name: 1,
          },
          genreBookCount: 1,
        },
      },
    ]);
    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).send("Server error" + error);
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {

    if (!req.body.title || !req.body.genres || !req.body.description || !req.body.author) {
      return res.status(400).send("Required Details Missing");
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
    res.status(200).send(`Book Created: ${books}`);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteBookById = async (req: Request, res: Response) => {
  try {
    // const currUser = req.user;
    console.log("req.params.id", req.params.id);
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send("Book not found");
    }

    // if (book.author.toString() !== currUser._id.toString()) {
    //   return res.status(403).send("You are not the owner of this book");
    // }
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send(`Book Deleted: ${book.title}`);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// export const findBookByNames = async (req: Request, res: Response) => {
//   try {
//     const authorName = req.query.author as string;
//     const genreName = req.query.genre as string;
//     let whereClause: any = {};

//     if (authorName && genreName) {
//       whereClause = {
//         $and: [{ "author.username": authorName }, { "genres.name": genreName }],
//       };
//     } else if (authorName || genreName) {
//       whereClause = {
//         $or: [{ "author.username": authorName }, { "genres.name": genreName }],
//       };
//     }

//     const book = await Book.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "author",
//           foreignField: "_id",
//           as: "author",
//         },
//       },
//       { $unwind: "$author" },
//       {
//         $lookup: {
//           from: "genres",
//           localField: "genres",
//           foreignField: "_id",
//           as: "genres",
//         },
//       },

//       {
//         $facet: {
//           totalBooks: [{ $count: "count" }],
//           books: [
//             {
//               $match: whereClause,
//             },
//             {
//               $project: {
//                 title: 1,
//                 description: 1,
//                 author: {
//                   username: 1,
//                 },
//                 genres: {
//                   name: 1,
//                 },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     if (!book.length) {
//       return res.status(404).send("Book not found");
//     }

//     res.status(200).json({ message: `Book Found:`, data: book });
//   } catch (error) {
//     res.status(500).send("Server error");
//   }
// };
