// Como no usamos BD, esta es solo una clase para definir la estructura
export class Payment {
  _id: string;
  reservationId: string;
  amount: number;
  userId: string;
  paymentMethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
