import { Request, Response } from "express";
import Glicemia from "./glicemia.model";


// ✅ CREATE
export const create = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = await Glicemia.create({
      ...req.body,
      user,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};


// ✅ LIST
export const list = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = await Glicemia.find({ user }).sort({ fecha: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};


// ✅ GET ONE
export const getOne = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = await Glicemia.findOne({
      _id: req.params.id,
      user,
    });

    if (!data) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};


// ✅ UPDATE
export const update = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = await Glicemia.findOneAndUpdate(
      {
        _id: req.params.id,
        user,
      },
      req.body,
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};


// ✅ DELETE
export const remove = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = await Glicemia.findOneAndDelete({
      _id: req.params.id,
      user,
    });

    if (!data) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};