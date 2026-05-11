import { Response, NextFunction } from "express";
import { AuthRequest } from "@/middlewares/auth";

export const isAuthor = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!req.user.isAuthor) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
