import { AuthRequest } from "@/middlewares/auth";
import Book from "@/models/books";
import { prisma } from "@/lib/prisma";

import { Response } from "express";
import mongoose from "mongoose";

export const getBooksByAuthor = async (req: AuthRequest, res: Response) => {
  try {
    const books = await prisma.books.findMany({
      where: {
        authorId: req.params.authorId as string,
      },

      select: {
        title: true,
        description: true,

        author: {
          select: {
            username: true,
          },
        },

        genres: {
          select: {
            name: true,
          },
        },
      },
    });
    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "author",
    //     foreignField: "_id",
    //     as: "author",
    //   },
    // },
    // {
    //   $lookup: {
    //     from: "genres",
    //     localField: "genres",
    //     foreignField: "_id",
    //     as: "genres",
    //   },
    // },
    // {
    //   $project: {
    //     title: 1,
    //     description: 1,
    //     author: {
    //       username: 1,
    //     },
    //     genres: {
    //       name: 1,
    //     },
    //   },
    // },
    // );

    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).send("Server error" + error);
  }
};
