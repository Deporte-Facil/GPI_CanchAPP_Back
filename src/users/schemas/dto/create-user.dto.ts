// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  lastName: string;

  @ApiProperty({ description: 'Correo electrónico del usuario (debe ser único)', example: 'juan.perez@example.com' })
  @IsEmail({}, { message: 'Debe ser un formato de correo electrónico válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario (mínimo 6 caracteres)', example: 'password123' }) // <-- REMOVIDO
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario (por defecto: user)',
    enum: ['user', 'admin'],
    required: false,
    example: 'user'
  })
  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto.' })
  @IsIn(['user', 'admin'], { message: 'El rol debe ser "user" o "admin".' })
  role?: string;
}
