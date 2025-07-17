import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // <-- ¡IMPORTACIÓN NECESARIA AÑADIDA!
import { User } from '../../users/schemas/user.schema'; 
import { Enclosure } from '../../enclosure/schema/enclosure.schema'; 

export type PlayeDocument = Playe & Document;

@Schema({ timestamps: true })
export class Playe extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Enclosure', required: true })
  enclosure: Enclosure;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User; 

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({
    type: String,
    enum: ['pendiente', 'confirmado', 'rechazado'],
    default: 'pendiente',
    required: true,
  })
  estado: string;
}

export const PlayeSchema = SchemaFactory.createForClass(Playe);