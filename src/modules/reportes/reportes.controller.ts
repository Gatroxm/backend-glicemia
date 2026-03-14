import { Request, Response } from "express";
import { getGlicemiasByUser } from "./reportes.service";
import { generateExcelBuffer } from "./reportes.excel";

export const generateExcel = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const glicemias = await getGlicemiasByUser(user);

    const excelBuffer = await generateExcelBuffer(glicemias);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte-glicemias.xlsx"
    );

    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json(error);
  }
};
