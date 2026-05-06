import { request, response } from "express";

let users: { id: number; username: string }[] = [];

export const getHello = (req: typeof request, res: typeof response) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).send("Username query parameter is required");
  }

  res.send(`Hello, ${username}!`);
};

export const createUser = (req: typeof request, res: typeof response) => {
  const username: string = req.body.username;
  const id: number = users.length + 1;

  if (users.find((user) => user.username == username)) {
    return res.status(400).send("Username already exists");
  }
  if (!username) {
    return res.status(400).send("Username body parameter is required");
  }

  users.push({ id, username });
  res.status(201).send(`User created with ID: ${id}`);
};

export const getUserById = (req: typeof request, res: typeof response) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id as string));
  if (!user) {
    return res.status(404).send("user not found");
  }

  //   users.push({ id, username });
  res.status(201).send(`User Found with ID: ${JSON.stringify(user)}`);
};

export const getUsers = (req: typeof request, res: typeof response) => {
  const user = JSON.stringify(users);
  //   if (!user) {
  //     return res.status(404).send("user not found");
  //   }

  //   users.push({ id, username });
  res.status(201).send(`Users Found: ${user}`);
};
