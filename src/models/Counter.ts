// Modelo `Counter` — utilizado para guardar contadores sequenciais
// (por exemplo: o próximo `productId`).
import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  // Nome do contador (ex: 'productId')
  name: string;
  // Valor actual do contador
  value: number;
}

const CounterSchema = new Schema<ICounter>({
  // Nome único do contador
  name: { type: String, required: true, unique: true },
  // Valor numérico do contador (inicia em 0)
  value: { type: Number, default: 0 },
});

// Exportar o modelo. Ao recarregar em ambientes com hot-reload,
// evitar redefinir o modelo se já existir em mongoose.models.
export const Counter = mongoose.models.Counter as mongoose.Model<ICounter> || mongoose.model<ICounter>("Counter", CounterSchema);
