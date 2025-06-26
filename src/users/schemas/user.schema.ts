// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// --- Interfaz y Schema para Tarjetas de Crédito/Débito ---
// Representa un método de pago de tarjeta para el usuario.
// Nota de Seguridad: NO se almacena el número de tarjeta completo ni el CVV.
// Para procesamiento de pagos, se usarían tokens de pasarelas de pago.
@Schema()
export class CreditCard {
  // Se usa un sub-ID para cada tarjeta, generado por Mongoose al añadir al array
  // No necesitamos un @Prop({ type: Types.ObjectId }) aquí si el ID es interno al array
  // Mongoose añade _id automáticamente a los subdocumentos en arrays si no se especifica.

  @Prop({ required: true })
  last4Digits: string; // Últimos 4 dígitos para identificación visual (seguro)

  @Prop({ required: true })
  cardHolderName: string; // Nombre del titular de la tarjeta

  @Prop({ required: true })
  expiryDate: string; // Fecha de expiración en formato MM/AA (ej. "12/25")

  @Prop({ required: true })
  type: string; // Tipo de tarjeta (ej. 'Visa', 'Mastercard', 'American Express')

  @Prop({ default: Date.now }) // Fecha y hora en que se añadió la tarjeta
  addedAt: Date;
}

// Crea el schema para CreditCard
export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);

// --- Interfaz principal de Usuario ---
export interface UserDocument extends User, Document {
  id: string; // Mongoose crea un getter 'id' que devuelve el _id como string
}

@Schema({
  timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  toJSON: {
    virtuals: true, // Habilita los virtuals (como el 'id')
    transform: (_, ret) => { // Transforma la salida del JSON
      ret.id = ret._id; // Mapea _id a id
      delete ret._id; // Elimina _id
      delete ret.__v; // Elimina __v
      // Opcional: Si quieres omitir campos sensibles incluso en el array de tarjetas
      // Por ejemplo, para ocultar 'cvv' si lo hubieras almacenado (aunque no deberías)
      // if (ret.paymentMethods) {
      //   ret.paymentMethods = ret.paymentMethods.map((pm: any) => {
      //     const { cvv, ...rest } = pm; // Ejemplo: elimina cvv
      //     return rest;
      //   });
      // }
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

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' }) // 'admin' o 'user'
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  // --- Nuevo arreglo para tarjetas de débito/crédito ---
  // Define un arreglo de subdocumentos usando el CreditCardSchema
  @Prop({ type: [CreditCardSchema], default: [] })
  paymentMethods: CreditCard[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Añadir un virtual 'id' para acceso más fácil al _id como string
UserSchema.virtual('id').get(function (this: Document) {
  return (this._id as Types.ObjectId).toHexString();
});
