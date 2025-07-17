import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumberString,
  ValidateNested,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFieldDto } from 'src/field/dto/create-field.dto';

export class CreateEnclosureDto {
  @IsString()
  @IsNotEmpty()
  id_admin: string;
  
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tipoDeporte: string;

  @IsNumberString()
  jugadoresMax: string;

  @IsNumberString()
  costo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  materiales?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsBoolean()
  estacionamiento: boolean;

  @IsBoolean()
  petos: boolean;

  @IsBoolean()
  arbitros: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  servicios: string[];

  @IsDate()
  @Type(() => Date)
  fechaDisponible: Date;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['automática', 'manual'], { message: 'El modo de confirmación debe ser "automática" o "manual".' })
  modoConfirmacion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  @ArrayMinSize(1)
  canchas: CreateFieldDto[];
}