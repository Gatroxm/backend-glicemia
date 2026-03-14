import { Request, Response } from "express";
import User from "./user.model";


// editar usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};


// cambiar role
export const changeRole = async (req: Request, res: Response) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.params.id,
      {
        role: req.body.role,
      },
      { new: true }
    );

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};


// listar usuarios
export const listUsers = async (req: Request, res: Response) => {
  const data = await User.find();
  res.json(data);
};