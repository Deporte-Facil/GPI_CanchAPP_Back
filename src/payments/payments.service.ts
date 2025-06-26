import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
// Corregido para apuntar a la carpeta 'schema'
import { Payment } from './schema/payment.entity';
import { randomUUID } from 'crypto'; // Para generar IDs únicos

@Injectable()
export class PaymentsService {
  // Array en memoria para simular la base de datos
  private readonly payments: Payment[] = [];

  create(createPaymentDto: CreatePaymentDto): Payment {
    const newPayment: Payment = {
      _id: randomUUID(),
      status: 'completed',
      ...createPaymentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.payments.push(newPayment);
    console.log('Pago simulado y guardado en memoria:', newPayment);
    return newPayment;
  }

  findAll(): Payment[] {
    return this.payments;
  }

  findOne(id: string): Payment {
    const payment = this.payments.find((p) => p._id === id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return payment;
  }

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: string) {
    return `This action removes a #${id} payment`;
  }
}
