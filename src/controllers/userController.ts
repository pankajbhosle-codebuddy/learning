import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";
import { request, response } from "express";
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
  const isAuthor: boolean = req.body.isAuthor || false;
  const password: string = req.body.password;

  if (await prisma.users.findFirst({ where: { username } })) {
    return res.status(400).json({ error: "Username already exists" });
  }
  if (!username || !password) {
    return res.status(400).json({ error: "Required Details Missing" });
  }
  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.users.create({
      data: { username, isAuthor, password: hashedPassword },
    });
    res.status(201).json({ message: `users created:`, data: user });
  } catch (err) {
    res.status(500).json({ error: "Error creating user: " + err });
  }
};

export const getUserById = async (
  req: typeof request,
  res: typeof response,
) => {
  const id = req.params.id as string;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const user = await prisma.users.findFirst({
    where: { id },
    select: { password: false, id: true, username: true, isAuthor: true },
  });
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  res.status(201).json({ message: `users Found with ID: ${user}`, data: user });
};

export const getUsers = async (req: typeof request, res: typeof response) => {
  const user = await prisma.users.findMany({
    select: { password: false, id: true, username: true, isAuthor: true },
  });

  res.status(201).json({ message: `Users Found: ${user.length}`, data: user });
};

export const deleteUsers = async (
  req: typeof request,
  res: typeof response,
) => {
  const user = await prisma.users.deleteMany();

  res.status(201).json({ message: `Users Deleted: ${user.count}` });
};
