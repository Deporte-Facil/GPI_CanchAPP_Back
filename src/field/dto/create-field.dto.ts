import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  @IsNotEmpty()
  tipoCancha: string;

  @IsNumberString()
  cantidad: string;

  @IsString()
  horariosDisponibles: string;

  @IsString()
  materialesCancha: string;
}