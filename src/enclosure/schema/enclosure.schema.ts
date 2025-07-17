import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnclosureDocument = Enclosure & Document;

@Schema({ timestamps: true })
export class Enclosure extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  tipoDeporte: string;

  @Prop()
  jugadoresMax: number;

  @Prop()
  costo: number;

  @Prop()
  descripcion: string;

  @Prop()
  materiales: string;

  @Prop()
  ubicacion: string;

  @Prop({ default: false })
  estacionamiento: boolean;

  @Prop({ default: false })
  petos: boolean;

  @Prop({ default: false })
  arbitros: boolean;

  @Prop({ type: [String], default: [] })
  servicios: string[];

  @Prop({ type: Date })
  fechaDisponible: Date;

  @Prop()
  imagen_url: string;
  
  @Prop({
    type: String,
    enum: ['automática', 'manual'],
    default: 'manual',
    required: true,
  })
  modoConfirmacion: string;
}

export const EnclosureSchema = SchemaFactory.createForClass(Enclosure);