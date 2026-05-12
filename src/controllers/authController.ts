import { request, response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { comparePassword } from "@/utils/password";

export const login = async (req: typeof request, res: typeof response) => {
  const username = req.body.username;

  // const user = await User.findOne({ username: username as string });
  const user = await prisma.users.findFirst({
    where: {
      username: username as string,
    },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const compare = await comparePassword(req.body.password, user.password);

  if (compare) {
    let token = await prisma.tokens.findFirst({
      where: {
        userId: user.id,
        expiresIn: { gt: new Date() },
      },
    });
    if (token && token !== null) {
      return res.status(200).json({ message: "logged in", data: token });
    }
    const newtoken = generateToken(user.id, user.isAuthor);
    token = await prisma.tokens.create({
      data: {
        token: newtoken,
        expiresIn: new Date(
          Date.now() + Number(process.env.JWT_EXPIRES_IN as string) * 60 * 1000,
        ),
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        v: 0,
      },
    });
    // console.log("newtoken", newtoken);
    res.status(200).json({ message: "logged in", data: token });
  } else {
    res.status(400).json({ message: "invalid credentials" });
  }
};

const generateToken = (id: string, isAuthor: boolean) => {
  console.log("process.env.JWT_EXPIRES_IN", process.env.JWT_EXPIRES_IN);
  return jwt.sign({ id, isAuthor }, process.env.JWT_SECRET as string, {
    expiresIn:
      Number(process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) * 60,
  });
};
