import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; // Asegúrate de importar BadRequestException
import { CreateEnclosureDto } from './dto/create-enclosure.dto';
import { UpdateEnclosureDto } from './dto/update-enclosure.dto';
import { Enclosure, EnclosureDocument } from './schema/enclosure.schema';
import { Field, FieldDocument } from 'src/field/schema/field.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // <-- ¡IMPORTACIÓN NECESARIA AÑADIDA!

@Injectable()
export class EnclosureService {
  constructor(
    @InjectModel(Enclosure.name) private enclosureModel: Model<EnclosureDocument>,
    @InjectModel(Field.name) private fieldModel: Model<FieldDocument>
  ) {}

  async create(createEnclosureDto: CreateEnclosureDto) {
    const canchasDto = createEnclosureDto.canchas; 
    
    const enclosureData = {
      ...createEnclosureDto,
      canchas: undefined 
    };
    delete enclosureData.canchas; 

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
    const enclosures = await this.enclosureModel.find().lean().exec();
    
    const enclosuresWithFields = await Promise.all(
      enclosures.map(async (enclosure) => {
        const canchas = await this.fieldModel.find({ enclosureId: enclosure._id }).exec();
        return { ...enclosure, canchas: canchas.map(c => c.toObject({ getters: true, virtuals: true })) }; 
      })
    );
    return enclosuresWithFields as EnclosureDocument[]; 
  }

  async findOne(id: string) {
    // Añadir validación del ObjectId antes de buscar
    if (!Types.ObjectId.isValid(id)) { // <-- Types ahora disponible
      console.error('ERROR: ID de recinto inválido en findOne:', id);
      throw new BadRequestException('ID de recinto inválido.'); 
    }
    return this.enclosureModel.findById(id).exec();
  }

  update(id: string, updateEnclosureDto: UpdateEnclosureDto) {
    const enclosureData = { ...updateEnclosureDto } as any;
    delete enclosureData.canchas; 
    return this.enclosureModel.findByIdAndUpdate(id, enclosureData, { new: true });
  }

  remove(id: string) {
    return this.enclosureModel.findByIdAndDelete(id);
  }
}