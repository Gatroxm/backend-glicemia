import Glicemia from "../glicemias/glicemia.model";

export const getGlicemiasByUser = async (userId: string) => {
  const glicemias = await Glicemia.find({ user: userId }).sort({ fecha: -1 });
  return glicemias;
};
