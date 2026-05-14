import { Request, Response } from "express";




export const sayHelloFromParams = (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).send("Username parameter is required");
  }

  res.send(`Hello, ${username}!`);
};

export const sayHelloFromBody = (req: Request, res: Response) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).send("Username body parameter is required");
  }

  res.send(`Hello, ${username}!`);
};

export const sayHello = (req: Request, res: Response) => {


  res.send(`Hello, world!`);
};