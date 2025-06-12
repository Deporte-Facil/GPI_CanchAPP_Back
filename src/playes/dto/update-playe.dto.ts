import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayeDto } from './create-playe.dto';

export class UpdatePlayeDto extends PartialType(CreatePlayeDto) {}
