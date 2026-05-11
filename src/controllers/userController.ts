import { request, response } from "express";
import User from "@/models/users";
import { isValidObjectId } from "mongoose";

export const getHello = (req: typeof request, res: typeof response) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).send("Username query parameter is required");
  }

  res.send(`Hello, ${username}!`);
};

export const createUser = async (req: typeof request, res: typeof response) => {
  const username: string = req.body.username;
  const isAuthor: boolean = req.body.isAuthor;
  const password: string = req.body.password;

  if (await User.findOne({ username })) {
    return res.status(400).send("Username already exists");
  }
  if (!username || !password) {
    return res.status(400).send("Required Details Missing");
  }
  try {
    const user = await User.create({ username, isAuthor, password });
    res.status(201).send(`User created: ${user}`);
  } catch (err) {
    res.status(500).send("Error creating user: " + err);
  }
};

export const getUserById = async (
  req: typeof request,
  res: typeof response,
) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).send("invalid id");
  }
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).send("user not found");
  }

  res.status(201).send(`User Found with ID: ${user}`);
};

export const getUsers = async (req: typeof request, res: typeof response) => {
  const user = await User.find().select("-password");

  res.status(201).send(`Users Found: ${user}`);
};

export const deleteUsers = async (
  req: typeof request,
  res: typeof response,
) => {
  const user = await User.deleteMany();

  res.status(201).send(`Users Deleted: ${JSON.stringify(user)}`);
};
