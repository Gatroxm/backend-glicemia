import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    (req as any).user = decoded.id;

    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}