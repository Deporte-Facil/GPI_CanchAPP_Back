import { Module } from '@nestjs/common';
import { PlayesService } from './playes.service';
import { PlayesController } from './playes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Playe, PlayeSchema } from './entities/playe.entity';
import { EnclosureModule } from '../enclosure/enclosure.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Playe.name, schema: PlayeSchema }]),
    EnclosureModule, // Importamos el módulo completo de recintos
    UsersModule,     // Importamos el módulo de usuarios
  ],
  controllers: [PlayesController],
  providers: [PlayesService],
})
export class PlayesModule {}