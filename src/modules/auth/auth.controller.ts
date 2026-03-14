import User from "../users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {

  const { email, password, name } = req.body;

  try {

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ msg: "exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash,
      name
    });

    res.json(user);

  } catch (error) {
    res.status(500).json(error);
  }

};


export const login = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: "invalid" });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(400).json({ msg: "invalid" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    role: user.role,
    name: user.name,
  });
};