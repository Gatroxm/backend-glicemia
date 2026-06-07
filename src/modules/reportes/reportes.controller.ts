import { Request, Response } from "express";
import { getGlicemiasByUser } from "./reportes.service";
import { generateExcelBuffer } from "./reportes.excel";

// Interfaz extendida para mantener la consistencia de tipado en todo tu backend 🛡️
interface AuthenticatedRequest extends Request {
  user?: string;
}

export const generateExcel = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ msg: "No autorizado, falta el identificador del usuario" });
    }

    // Trae las glicemias de la base de datos (con las nuevas propiedades del esquema)
    const glicemias = await getGlicemiasByUser(userId);

    // Genera el buffer binario con el nuevo diseño azul y las 10 columnas completas
    const excelBuffer = await generateExcelBuffer(glicemias);

    // Configuramos las cabeceras HTTP de forma segura para la descarga del archivo binario
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte-glicemias.xlsx"
    );

    // Enviamos el buffer binario al cliente (Angular / Ionic)
    return res.send(excelBuffer);

  } catch (error: any) {
    console.error("Error al generar el buffer de Excel:", error);
    return res.status(500).json({ 
      msg: "Error interno al procesar el reporte de Excel", 
      error: error.message || error 
    });
  }
};