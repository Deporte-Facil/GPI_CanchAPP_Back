import { Injectable } from '@nestjs/common';
import { CreateEnclosureDto } from './dto/create-enclosure.dto';
import { UpdateEnclosureDto } from './dto/update-enclosure.dto';
import { Enclosure, EnclosureDocument } from './schema/enclosure.schema';
import { Field, FieldDocument } from 'src/field/schema/field.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class EnclosureService {
  constructor(
    @InjectModel(Enclosure.name) private enclosureModel: Model<EnclosureDocument>,
    @InjectModel(Field.name) private fieldModel: Model<FieldDocument>
  ) {}


  async create(createEnclosureDto: CreateEnclosureDto) {
    const canchas : any = createEnclosureDto.canchas.map((cancha) => {
      return {
        tipoCancha: cancha.tipoCancha,
        cantidad: cancha.cantidad,
        horariosDisponibles: cancha.horariosDisponibles,
        materialesCancha: cancha.materialesCancha,
        };
    });

    const enclosure : any = {
        id_admin: createEnclosureDto.id_admin,
        nombre: createEnclosureDto.nombre,
        tipoDeporte: createEnclosureDto.tipoDeporte,
        jugadoresMax: createEnclosureDto.jugadoresMax,
        costo: createEnclosureDto.costo,
        descripcion: createEnclosureDto.descripcion,
        materiales: createEnclosureDto.materiales,
        ubicacion: createEnclosureDto.ubicacion,
        estacionamiento: createEnclosureDto.estacionamiento,
        petos: createEnclosureDto.petos,
        arbitros: createEnclosureDto.arbitros,
        servicios: createEnclosureDto.servicios,
        fechaDisponible: createEnclosureDto.fechaDisponible,
        imagen_url: createEnclosureDto.imagen_url,
      };

    if (await this.enclosureModel.findOne(enclosure)) return {
      message: 'Enclosure already exists',
      enclosure: null,
    };
    
    const newEnclosure = await this.enclosureModel.insertOne(enclosure);
    const idEnclosure = newEnclosure._id;

    canchas.forEach((cancha : any) => {
      cancha.enclosureId = idEnclosure;
    });
    
    const newCanchas = await this.fieldModel.insertMany(canchas);

    return {
      message: 'Enclosure created successfully',
      enclosure: {
        enclosure: newEnclosure,
        canchas: newCanchas,
      },
    };
  }

  findAll() {
    return `This action returns all enclosure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enclosure`;
  }

  update(id: number, updateEnclosureDto: UpdateEnclosureDto) {
    return `This action updates a #${id} enclosure`;
  }

  remove(id: number) {
    return `This action removes a #${id} enclosure`;
  }
}
