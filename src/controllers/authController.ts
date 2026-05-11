import User from "@/models/users";
import Token from "@/models/authToken";
import { request, response } from "express";
import jwt from "jsonwebtoken";

export const login = async (req: typeof request, res: typeof response) => {
  const username = req.body.username;

  const user = await User.findOne({ username: username as string });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const compare = await user.comparePassword(req.body.password);

  if (compare) {
    let token = await Token.findOne({
      user: user._id,
      expiresIn: { $gt: Date.now() },
    });
    if (token && token !== null) {
      return res.status(200).send("logged in: " + token);
    }
    const newtoken = generateToken(user._id.toString(), user.isAuthor);
    token = await Token.create({
      token: newtoken,
      expiresIn:
        Date.now() + Number(process.env.JWT_EXPIRES_IN as string) * 60 * 1000,
      user: user._id,
    });
    console.log("newtoken", newtoken);
    res.status(200).send("logged in: " + token);
  } else {
    res.status(400).send("invalid credentials");
  }
};

const generateToken = (id: string, isAuthor: boolean) => {
  console.log("process.env.JWT_EXPIRES_IN", process.env.JWT_EXPIRES_IN);
  return jwt.sign({ id, isAuthor }, process.env.JWT_SECRET as string, {
    expiresIn:
      Number(process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) * 60,
  });
};
