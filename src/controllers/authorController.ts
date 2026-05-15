
import { prisma } from "@/lib/prisma";

import { Request, Response } from "express";

export const createAuthor = async (req: Request, res: Response) => {
  const username: string = req.body.username;

  const isExistsingAuthor = await prisma.author.findUnique({
    where: {
      username,
    },
  });
  if (isExistsingAuthor) {
    return res.status(400).send("Author already exists");
  }
  if (!username) {
    return res.status(400).send("Username is required");
  }

  try {
    const author = await prisma.author.create({
      data: {
        username,
      },
    });

    res.status(200).json({ message: "Author created successfully", data: author });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }


}
export const getBooksByAuthor = async (req: Request, res: Response) => {
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
    
    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error });
  }
};
