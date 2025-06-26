// src/users/dto/add-payment-method.dto.ts
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreditCardDto } from './credit-card.dto';

export class AddPaymentMethodDto {
  @ApiProperty({
    description: 'El ID del usuario al que se añadirá el método de pago.',
    example: '60c72b2f9b1e8b001c8e8e8e', // Ejemplo de ObjectId de MongoDB
  })
  @IsString()
  @IsNotEmpty()
  userId: string; // Asume que recibes el userId para el que se añade la tarjeta

  @ApiProperty({
    description: 'Los detalles del método de pago de la tarjeta.',
    type: CreditCardDto,
  })
  @ValidateNested() // Importante para validar el sub-DTO
  @Type(() => CreditCardDto) // Importante para la transformación a la clase DTO
  paymentMethod: CreditCardDto;

  // Si usas un token para el pago real, este sería el lugar:
  @ApiProperty({
    description: 'Token de la tarjeta generado por la pasarela de pago (NO es el número de tarjeta).',
    example: 'tok_visa_xxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  paymentToken: string; // Este es el token que la pasarela de pago te dio.
}