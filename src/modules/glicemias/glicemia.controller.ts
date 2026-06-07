import { Request, Response } from "express";
import Glicemia from "./glicemia.model";


interface AuthenticatedRequest extends Request {
  user?: string; 
}

// ✅ CREATE
export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ msg: "No autorizado, falta el usuario" });
    }

    const data = await Glicemia.create({
      ...req.body,
      user: userId,
    });

    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ 
      msg: "Error al crear el registro de glicemia", 
      error: error.message || error 
    });
  }
};

// ✅ LIST
export const list = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;

    const data = await Glicemia.find({ user: userId }).sort({ fecha: -1 });

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ 
      msg: "Error al listar las glicemias", 
      error: error.message || error 
    });
  }
};

// ✅ GET ONE
export const getOne = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;

    const data = await Glicemia.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!data) {
      return res.status(404).json({ msg: "Registro no encontrado" });
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ 
      msg: "Error al obtener el registro", 
      error: error.message || error 
    });
  }
};

// ✅ UPDATE
export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;

    const data = await Glicemia.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },
      req.body,
      { 
        new: true, 
        runValidators: true
      }
    );

    if (!data) {
      return res.status(404).json({ msg: "Registro no encontrado para actualizar" });
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ 
      msg: "Error al actualizar el registro", 
      error: error.message || error 
    });
  }
};

// ✅ DELETE
export const remove = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;

    const data = await Glicemia.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });
    console.log("Registro eliminado:", data);
    if (!data) {
      return res.status(404).json({ msg: "Registro no encontrado para eliminar" });
    }

    return res.json({ msg: "Registro eliminado correctamente", id: req.params.id });
  } catch (error: any) {
    return res.status(500).json({ 
      msg: "Error al eliminar el registro", 
      error: error.message || error 
    });
  }
};