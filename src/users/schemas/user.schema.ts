import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // <-- ¡IMPORTACIÓN NECESARIA AÑADIDA!

@Schema()
export class CreditCard {
  @Prop({ required: true })
  last4Digits: string;

  @Prop({ required: true })
  cardHolderName: string;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: Date.now })
  addedAt: Date;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);

export type UserDocument = User & Document; 

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => { 
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) 
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [CreditCardSchema], default: [] })
  paymentMethods: CreditCard[];
}

export const UserSchema = SchemaFactory.createForClass(User);