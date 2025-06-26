// src/users/dto/credit-card.dto.ts
import { IsString, IsNotEmpty, IsCreditCard, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Para documentación con Swagger/OpenAPI

export class CreditCardDto {
  @ApiProperty({
    description: 'Últimos 4 dígitos de la tarjeta (para identificación visual). No almacenar el número completo.',
    example: '4242',
    maxLength: 4,
    minLength: 4,
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Los últimos 4 dígitos deben tener exactamente 4 caracteres.' })
  @Matches(/^\d{4}$/, { message: 'Los últimos 4 dígitos deben ser numéricos.' })
  last4Digits: string;

  @ApiProperty({
    description: 'Nombre del titular de la tarjeta.',
    example: 'JUAN PEREZ GARCIA',
  })
  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @ApiProperty({
    description: 'Fecha de expiración de la tarjeta en formato MM/AA (ej. 12/25).',
    example: '12/25',
    pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'La fecha de expiración debe tener el formato MM/AA.' })
  expiryDate: string;

  @ApiProperty({
    description: 'Tipo de tarjeta (ej. Visa, Mastercard, American Express).',
    example: 'Visa',
  })
  @IsString()
  @IsNotEmpty()
  type: string; // Esto podría ser un enum para mayor validación (ej. @IsEnum)

  // Nota: 'addedAt' se generará automáticamente en el schema por defecto.
  // Si usas un token de pasarela de pago, podrías añadir un campo aquí:
  // @ApiProperty({
  //   description: 'Token de la tarjeta proporcionado por la pasarela de pago.',
  //   example: 'tok_visa_xxxxxxxxxxxxxxxx',
  // })
  // @IsString()
  // @IsNotEmpty()
  // token: string;
}