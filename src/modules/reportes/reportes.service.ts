import Glicemia from "../glicemias/glicemia.model";

export const getGlicemiasByUser = async (userId: string) => {
  const glicemias = await Glicemia.find({ user: userId })
    .sort({ fecha: -1 })
    .lean(); // .lean() es excelente para rendimiento porque devuelve JSON plano de JS

  // Mapeamos explícitamente todo el espectro de datos para el reporte de ExcelJS
  return glicemias.map((g: any) => ({
    fecha: g.fecha,
    valor: g.valor,
    tipo: g.tipo,
    carbohidratos: g.carbohidratos || 0,
    insulina: {
      unidades: g.insulina?.unidades || 0,
      tipoInsulina: g.insulina?.tipoInsulina || "ninguna",
      ratioUtilizado: g.insulina?.ratioUtilizado || 0
    },
    hizoEjercicio: g.hizoEjercicio || false,
    notes: g.notes || ""
  }));
};