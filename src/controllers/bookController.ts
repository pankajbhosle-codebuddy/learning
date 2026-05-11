import { AuthRequest } from "@/middlewares/auth";
import Book from "@/models/books";
import { Response } from "express";

export const getBooks = async (req: AuthRequest, res: Response) => {
  try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      // {$unwind: "$author"},
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
            // $arrayElemAt: ["$author", 0]
            username: 1,
          },
          genres: {
            name: 1,
          },
        },
      },
    ]);
    //   .populate(
    //   "author", "username"
    // ).populate("genres", "name");
    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).send("Server error" + error);
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const author = req.user;
    if (!author.isAuthor) {
      req.user.isAuthor = true;
      await req.user.save();
    }
    if (!req.body.title || !req.body.genres || !req.body.description) {
      return res.status(400).send("Required Details Missing");
    }
    const books = await Book.create({
      title: req.body.title,
      author: author._id,
      genres: req.body.genres,
      description: req.body.description,
    });
    res.status(200).send(`Book Created: ${books}`);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteBookById = async (req: AuthRequest, res: Response) => {
  try {
    const currUser = req.user;
    console.log("req.params.id", req.params.id);
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send("Book not found");
    }

    if (book.author.toString() !== currUser._id.toString()) {
      return res.status(403).send("You are not the owner of this book");
    }
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send(`Book Deleted: ${book.title}`);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const findBookByNames = async (req: AuthRequest, res: Response) => {
  try {
    const authorName = req.query.author as string;
    const genreName = req.query.genre as string;
    let whereClause: any = {};

    if (authorName && genreName) {
      whereClause = {
        $and: [{ "author.username": authorName }, { "genres.name": genreName }],
      };
    } else if (authorName || genreName) {
      whereClause = {
        $or: [{ "author.username": authorName }, { "genres.name": genreName }],
      };
    }

    const book = await Book.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "genres",
          localField: "genres",
          foreignField: "_id",
          as: "genres",
        },
      },

      {
        $facet: {
          totalBooks: [{ $count: "count" }],
          books: [
            {
              $match: whereClause,
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
          ],
        },
      },
    ]);

    if (!book.length) {
      return res.status(404).send("Book not found");
    }

    res.status(200).json({ message: `Book Found:`, data: book });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
