import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  reservationId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
