import ExcelJS from "exceljs";

interface GlicemiaData {
  fecha: Date;
  valor: number;
  tipo: string;
}

const getEstado = (valor: number): { estado: string; color: string } => {
  if (valor < 70) {
    return { estado: "BAJA", color: "FF0000" };
  }
  if (valor > 140) {
    return { estado: "ALTA", color: "FF0000" };
  }
  return { estado: "NORMAL", color: "00FF00" };
};

export const generateExcelBuffer = async (
  glicemias: GlicemiaData[]
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Glicemias");

  worksheet.columns = [
    { header: "Fecha", key: "fecha", width: 20 },
    { header: "Valor", key: "valor", width: 10 },
    { header: "Tipo", key: "tipo", width: 15 },
    { header: "Estado", key: "estado", width: 12 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "CCCCCC" },
  };

  glicemias.forEach((g) => {
    const { estado, color } = getEstado(g.valor);
    const row = worksheet.addRow({
      fecha: g.fecha,
      valor: g.valor,
      tipo: g.tipo,
      estado: estado,
    });

    const estadoCell = row.getCell("estado");
    estadoCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
    estadoCell.font = { color: { argb: "FFFFFF" } };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
