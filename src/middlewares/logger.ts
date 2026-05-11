import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction): void {
  const { method, originalUrl } = req;
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    console.log(`[${timestamp}] ${method} ${originalUrl} ${res.statusCode}`);
  });

  next();
}
