import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function admin(
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

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ msg: "Not admin" });
    }

    (req as any).user = decoded.id;

    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}