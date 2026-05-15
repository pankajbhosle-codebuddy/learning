import { Request, Response } from "express";




export const sayHelloFromParams = (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ message: "Username parameter is required" });
  }

  res.json({ message: `Hello, ${username}!` });
};

export const sayHelloFromBody = (req: Request, res: Response) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).json({ message: "Username body parameter is required" });
  }

  res.json({ message: `Hello, ${username}!` });
};

export const sayHello = (req: Request, res: Response) => {


  res.json({ message: `Hello, world!` });
};