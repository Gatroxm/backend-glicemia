import mongoose from "mongoose";

const GlicemiaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    valor: {
      type: Number,
      required: true, // El valor de la glucometría en mg/dL
    },
    tipo: {
      type: String,
      required: true,
      enum: [
        "ayunas", 
        "pre_comida", 
        "post_comida", 
        "pre_entreno", 
        "post_entreno", 
        "madrugada", 
        "casual"
      ],
      default: "casual",
    },
    carbohidratos: {
      type: Number,
      default: 0,
    },
    insulina: {
      unidades: { type: Number, default: 0 },
      tipoInsulina: { 
        type: String, 
        enum: ["rapida", "basal", "ninguna"], 
        default: "ninguna" 
      },
      ratioUtilizado: { type: Number, default: 0 }
    },
    hizoEjercicio: {
      type: Boolean,
      default: false,
    },
    notas: {
      type: String,
      trim: true,
    },
    fecha: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true }
);


GlicemiaSchema.index({ user: 1, fecha: -1 });

export default mongoose.model("Glicemia", GlicemiaSchema);