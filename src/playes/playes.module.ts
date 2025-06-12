import { Module } from '@nestjs/common';
import { PlayesService } from './playes.service';
import { PlayesController } from './playes.controller';

@Module({
  controllers: [PlayesController],
  providers: [PlayesService],
})
export class PlayesModule {}
