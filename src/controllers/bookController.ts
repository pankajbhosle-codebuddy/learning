import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";

export const getBookById = async (req: Request, res: Response) => {
  try {
    const books = await prisma.books.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,

        author: {
          select: {
            username: true,
          },
        },

        genres: {
          select: {
            name: true,
          },
          genreBookCount: 1,
        },
      },
    });
    
    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {

    if (!req.body.title || !req.body.genres || !req.body.description || !req.body.authorId) {
      return res.status(400).send("Required Details Missing");
    }

    const book = await prisma.books.create({
      data: {
        title: req.body.title,
        description: req.body.description,

        author: {
          connect: {
            id: req.body.authorId,
          },
        },

        genres: {
          connect: req.body.genres.map((id: string) => ({
            id,
          })),
        },
      },
    });

    res.status(200).json({
      message: "Book Created",
      book,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

export const deleteBookById = async (req: Request, res: Response) => {
  try {
    console.log("req.params.id", req.params.id);
    const book = await prisma.books.findUnique({
      where: {
        id: req.params.id as string,
      },
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await prisma.books.delete({
      where: {
        id: req.params.id as string,
      },
    });
    res.status(200).send(`Book Deleted: ${book.title}`);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

