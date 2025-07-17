import { IsString, IsNotEmpty, IsDate, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlayeDto {
  @IsMongoId()
  @IsNotEmpty()
  enclosure: string;

  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  time: string;
}