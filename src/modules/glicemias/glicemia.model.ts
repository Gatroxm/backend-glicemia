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
      required: true,
    },

    tipo: {
      type: String,
      default: "normal",
    },
    hora:{
      type: String,
      require: true
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Glicemia", GlicemiaSchema);