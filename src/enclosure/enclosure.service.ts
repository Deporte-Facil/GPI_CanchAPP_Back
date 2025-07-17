import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEnclosureDto } from './dto/create-enclosure.dto';
import { UpdateEnclosureDto } from './dto/update-enclosure.dto';
import { Enclosure, EnclosureDocument } from './schema/enclosure.schema';
import { Field, FieldDocument } from 'src/field/schema/field.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class EnclosureService {
  constructor(
    @InjectModel(Enclosure.name) private enclosureModel: Model<EnclosureDocument>,
    @InjectModel(Field.name) private fieldModel: Model<FieldDocument>
  ) {}

  async create(createEnclosureDto: CreateEnclosureDto) {
    const canchasDto = createEnclosureDto.canchas;

    // Validar que el id_admin sea un ObjectId válido
    if (!Types.ObjectId.isValid(createEnclosureDto.id_admin)) {
      throw new BadRequestException('ID de administrador inválido.');
    }

    const enclosureData = {
      ...createEnclosureDto,
      admin: new Types.ObjectId(createEnclosureDto.id_admin), // <--- ¡AÑADIDO! Mapea id_admin a la propiedad 'admin'
      jugadoresMax: parseInt(createEnclosureDto.jugadoresMax, 10), // Convertir a número
      costo: parseInt(createEnclosureDto.costo, 10), // Convertir a número
      canchas: undefined // Eliminar canchas del objeto principal del recinto
    };
    delete enclosureData.canchas; // Asegurarse de que no se guarde en el modelo Enclosure

    const newEnclosure = new this.enclosureModel(enclosureData);
    await newEnclosure.save();

    const idEnclosure = newEnclosure._id;

    const canchasToInsert = canchasDto.map((canchaDto) => ({
      ...canchaDto,
      enclosureId: idEnclosure,
      cantidad: parseInt(canchaDto.cantidad, 10),
    }));

    const newCanchas = await this.fieldModel.insertMany(canchasToInsert);

    return {
      message: 'Enclosure created successfully',
      enclosure: newEnclosure,
      canchas: newCanchas,
    };
  }

  async findAll(): Promise<EnclosureDocument[]> {
    const enclosures = await this.enclosureModel.find()
      .populate({ path: 'admin', select: 'name lastName email' }) // <--- ¡AÑADIDO! Para popular el admin
      .lean()
      .exec();

    const enclosuresWithFields = await Promise.all(
      enclosures.map(async (enclosure) => {
        const canchas = await this.fieldModel.find({ enclosureId: enclosure._id }).exec();
        return { ...enclosure, canchas: canchas.map(c => c.toObject({ getters: true, virtuals: true })) };
      })
    );
    return enclosuresWithFields as EnclosureDocument[];
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      console.error('ERROR: ID de recinto inválido en findOne:', id);
      throw new BadRequestException('ID de recinto inválido.');
    }
    return this.enclosureModel.findById(id).populate({ path: 'admin', select: 'name lastName email' }).exec(); // <--- ¡AÑADIDO! Para popular el admin
  }

  update(id: string, updateEnclosureDto: UpdateEnclosureDto) {
    const enclosureData = { ...updateEnclosureDto } as any;
    delete enclosureData.canchas;
    // Si id_admin está presente en el DTO, también actualizarlo (opcional, pero buena práctica)
    if (updateEnclosureDto.id_admin) {
      enclosureData.admin = new Types.ObjectId(updateEnclosureDto.id_admin);
    }
    return this.enclosureModel.findByIdAndUpdate(id, enclosureData, { new: true });
  }

  remove(id: string) {
    return this.enclosureModel.findByIdAndDelete(id);
  }
}