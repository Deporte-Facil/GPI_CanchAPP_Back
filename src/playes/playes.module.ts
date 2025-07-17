import { Module } from '@nestjs/common';
import { PlayesService } from './playes.service';
import { PlayesController } from './playes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Playe, PlayeSchema } from './entities/playe.entity';
import { EnclosureModule } from '../enclosure/enclosure.module';
import { UsersModule } from '../users/users.module';
import { Enclosure, EnclosureSchema } from '../enclosure/schema/enclosure.schema'; // <--- ¡IMPORTAR EL ESQUEMA DE ENCLOSURE!

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Playe.name, schema: PlayeSchema }]),
    MongooseModule.forFeature([{ name: Enclosure.name, schema: EnclosureSchema }]), // <--- ¡AÑADIDO! Registrar el modelo Enclosure
    EnclosureModule, // Importamos el módulo completo de recintos (para EnclosureService)
    UsersModule,     // Importamos el módulo de usuarios
  ],
  controllers: [PlayesController],
  providers: [PlayesService],
})
export class PlayesModule {}
