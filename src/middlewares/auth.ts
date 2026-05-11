import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";

interface JwtPayload {
  id: string;
  isAuthor: boolean;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    // check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    // console.log("decoded", decoded);
    // get user without password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      error,
    });
  }
};
