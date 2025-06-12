import { Module } from '@nestjs/common';
import { EnclosureService } from './enclosure.service';
import { EnclosureController } from './enclosure.controller';

@Module({
  controllers: [EnclosureController],
  providers: [EnclosureService],
})
export class EnclosureModule {}
