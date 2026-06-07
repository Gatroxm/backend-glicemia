import ExcelJS from "exceljs";

// 1. Actualizamos la interfaz para que haga match perfecto con tu nuevo modelo de Mongoose
interface GlicemiaData {
  fecha: Date;
  valor: number;
  tipo: string;
  carbohidratos?: number;
  insulina?: {
    unidades: number;
    tipoInsulina: string;
    ratioUtilizado: number;
  };
  hizoEjercicio?: boolean;
  notes?: string;
}

// Helper para calcular el estado clínico con colores legibles en formato ARGB (ExcelJS)
const getEstado = (valor: number): { estado: string; color: string } => {
  if (valor <= 70) {
    return { estado: "BAJA", color: "FFD97D75" }; // Rojo suave / Alerta baja
  }

  if (valor >= 180) { // Ajustado a tu regla del frontend (>= 180 Alto)
    return { estado: "ALTA", color: "FFE05252" }; // Rojo fuerte / Alerta alta
  }

  return { estado: "NORMAL", color: "FF4CAF50" }; // Verde Material Design muy limpio
};

export const generateExcelBuffer = async (
  glicemias: GlicemiaData[]
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Glicemias");

  // 2. Expandimos las columnas para dar espacio a toda tu radiografía médica del día
  worksheet.columns = [
    { header: "Fecha y Hora", key: "fecha", width: 22 },
    { header: "Valor (mg/dL)", key: "valor", width: 15 },
    { header: "Momento / Tipo", key: "tipo", width: 18 },
    { header: "Estado", key: "estado", width: 12 },
    { header: "Carbohidratos (g)", key: "carbohidratos", width: 18 },
    { header: "Insulina (U)", key: "insulinaUnidades", width: 15 },
    { header: "Tipo Insulina", key: "tipoInsulina", width: 15 },
    { header: "Ratio (RIP)", key: "ratioUtilizado", width: 15 },
    { header: "Ejercitó", key: "hizoEjercicio", width: 12 },
    { header: "Notas / Observaciones", key: "notes", width: 35 },
  ];

  // Estilo elegante para la fila de los encabezados (Fila 1)
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF3880FF" }, // Color Azul primario idéntico al de tu app de Ionic 📱
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 25;

  // 3. Iteramos los registros mapeando los datos plans y los objetos anidados
  glicemias.forEach((g) => {
    const { estado, color } = getEstado(g.valor);
    
    // Formateamos la fecha para que en Excel no salga como string ISO feo, sino entendible
    const dateObj = new Date(g.fecha);
    const fechaFormateada = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const row = worksheet.addRow({
      fecha: fechaFormateada,
      valor: g.valor,
      tipo: g.tipo,
      estado: estado,
      carbohidratos: g.carbohidratos || 0,
      insulinaUnidades: g.insulina?.unidades || 0,
      tipoInsulina: g.insulina?.tipoInsulina || "ninguna",
      ratioUtilizado: g.insulina?.ratioUtilizado || 0,
      hizoEjercicio: g.hizoEjercicio ? "SÍ" : "NO", // Convertimos el boolean a texto legible
      notes: g.notes || "",
    });

    // Centramos las columnas numéricas y de estados para que se vea ordenado
    row.alignment = { vertical: "middle" };
    row.getCell("valor").alignment = { horizontal: "center" };
    row.getCell("estado").alignment = { horizontal: "center" };
    row.getCell("carbohidratos").alignment = { horizontal: "center" };
    row.getCell("insulinaUnidades").alignment = { horizontal: "center" };
    row.getCell("ratioUtilizado").alignment = { horizontal: "center" };
    row.getCell("hizoEjercicio").alignment = { horizontal: "center" };

    // Aplicamos el color dinámico a la celda del estado
    const estadoCell = row.getCell("estado");
    estadoCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
    estadoCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};