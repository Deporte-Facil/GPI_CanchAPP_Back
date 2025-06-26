import { Module } from '@nestjs/common';
import { EnclosureService } from './enclosure.service';
import { EnclosureController } from './enclosure.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Enclosure, EnclosureSchema } from './schema/enclosure.schema';
import { Field, FieldSchema } from 'src/field/schema/field.schema';


@Module({
  controllers: [EnclosureController],
  providers: [EnclosureService],
  imports: [
    MongooseModule.forFeature([{ name: Enclosure.name, schema: EnclosureSchema }]),
    MongooseModule.forFeature([{ name: Field.name, schema: FieldSchema }]),
  ],
})
export class EnclosureModule {}
