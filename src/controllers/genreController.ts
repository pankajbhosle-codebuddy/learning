import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";


export const createGenre = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Required Details Missing" });
    }
    if (await prisma.genres.findUnique({ where: { name: req.body.name } })) {
      return res.status(400).json({ error: "Genre Already Exists!" });
    }
    const genres = await prisma.genres.create({
      data: { name: req.body.name },
    });
    res
      .status(200)
      .json({ message: `Genre Created: ${genres.name}`, data: genres });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getBooksByGenre = async (req: Request, res: Response) => {
  try {
    const books = await prisma.books.findMany({
      where: {
        genres: {
          some: {
            id: req.params.genreId as string,
          },
        },
      },
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
        },
      },
    });
    res
      .status(200)
      .json({ message: `Books Found: ${books.length}`, data: books });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Server error" });
  }
};
