import { prisma } from "@/lib/prisma";
import { AuthRequest } from "@/middlewares/auth";
// import Book from "@/models/books";
import { Response } from "express";

export const getBooks = async (req: AuthRequest, res: Response) => {
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
        },
      },
    });
    
    res.status(200).json({ message: `Books Found:`, data: books });
  } catch (error) {
    res.status(500).send("Server error" + error);
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const author = req.user;

    if (!author.isAuthor) {
      await prisma.users.update({
        where: {
          id: author.id,
        },
        data: {
          isAuthor: true,
        },
      });
    }

    if (!req.body.title || !req.body.genres || !req.body.description) {
      return res.status(400).send("Required Details Missing");
    }

    const book = await prisma.books.create({
      data: {
        title: req.body.title,
        description: req.body.description,

        author: {
          connect: {
            id: author.id,
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

export const deleteBookById = async (req: AuthRequest, res: Response) => {
  try {
    const currUser = req.user;
    console.log("req.params.id", req.params.id);
    const book = await prisma.books.findUnique({
      where: {
        id: req.params.id as string,
      },
    });
    if (!book) {
      return res.status(404).send("Book not found");
    }

    if (book.authorId !== currUser.id) {
      return res.status(403).send("You are not the owner of this book");
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

export const findBookByNames = async (req: AuthRequest, res: Response) => {
  try {
    const authorName = req.query.author as string;
    const genreName = req.query.genre as string;
    let whereClause: any = {};

   if (authorName && genreName) {
     whereClause = {
       AND: [
         {
           author: {
             username: authorName,
           },
         },
         {
           genres: {
             some: {
               name: genreName,
             },
           },
         },
       ],
     };
   } else if (authorName || genreName) {
     whereClause = {
       OR: [
         {
           author: {
             username: authorName,
           },
         },
         {
           genres: {
             some: {
               name: genreName,
             },
           },
         },
       ],
     };
   }

  const book = await prisma.books.findMany({
    where: whereClause,
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

      _count: {
        select: {
          genres: true,
        },
      },
    },
  });

  if (!book || book.length === 0) {
    return res.status(404).send("Book not found");
  }

  const totalBooks = await prisma.books.count();

  return res.status(200).json({
    totalBooks,
    book,
  });
  } catch (error) {
    console.log('error', error)
    res.status(500).send("Server error");
  }
};
