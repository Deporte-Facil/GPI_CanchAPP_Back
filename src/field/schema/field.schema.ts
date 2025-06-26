import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Enclosure } from 'src/enclosure/schema/enclosure.schema';

export type FieldDocument = Field & Document;

@Schema({ timestamps: true })
export class Field {

  @Prop({ required: true })
  tipoCancha: string;

  @Prop({ type: Number, default: 1 })
  cantidad: number;

  @Prop()
  horariosDisponibles: string;

  @Prop()
  materialesCancha: string;

  @Prop({ type: Types.ObjectId, ref: Enclosure.name, required: true })
  enclosureId: Types.ObjectId;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
