import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePlayeDto } from './dto/create-playe.dto';
import { UpdatePlayeDto } from './dto/update-playe.dto';
import { Playe, PlayeDocument } from './entities/playe.entity';
import { Enclosure, EnclosureDocument } from '../enclosure/schema/enclosure.schema'; // Importar el modelo de Enclosure

@Injectable()
export class PlayesService {
  constructor(
    @InjectModel(Playe.name) private playeModel: Model<PlayeDocument>,
    @InjectModel(Enclosure.name) private enclosureModel: Model<EnclosureDocument>, // Inyectar el modelo de Enclosure
  ) {}

  async create(playeData: any): Promise<Playe> {
    console.log('--- playes.service.ts: Datos recibidos para crear Playe ---');
    console.log(playeData);
    console.log('----------------------------------------------------------');

    const dataToSave = { ...playeData };
    if (dataToSave.user && typeof dataToSave.user === 'string' && !Types.ObjectId.isValid(dataToSave.user)) {
        console.error('ERROR: User ID en playeData no es un ObjectId válido:', dataToSave.user);
        throw new BadRequestException('User ID provided is not a valid MongoDB ObjectId.');
    }
    if (dataToSave.enclosure && typeof dataToSave.enclosure === 'string' && !Types.ObjectId.isValid(dataToSave.enclosure)) {
        console.error('ERROR: Enclosure ID en playeData no es un ObjectId válido:', dataToSave.enclosure);
        throw new BadRequestException('Enclosure ID provided is not a valid MongoDB ObjectId.'); // Cambiado a BadRequestException
    }

    const createdPlaye = new this.playeModel(dataToSave);
    try {
        const savedPlaye = await createdPlaye.save();
        console.log('--- playes.service.ts: Playe guardado exitosamente ---');
        console.log(savedPlaye);
        return savedPlaye;
    } catch (error: any) { // Tipado el error
        console.error('--- playes.service.ts: Error al guardar Playe ---');
        console.error('Detalles del error:', error.message);
        throw error;
    }
  }

  async findAll(): Promise<Playe[]> {
    return this.playeModel.find()
      .populate({ path: 'enclosure', select: 'nombre admin', populate: { path: 'admin', select: 'name lastName email' } }) // Popular recinto y su admin
      .populate({ path: 'user', select: 'name lastName email' })
      .exec();
  }

  async findOne(id: string): Promise<Playe> {
    const playe = await this.playeModel.findById(id)
      .populate({ path: 'enclosure', select: 'nombre admin', populate: { path: 'admin', select: 'name lastName email' } })
      .populate({ path: 'user', select: 'name lastName email' })
      .exec();
    if (!playe) {
      throw new NotFoundException(`Reserva con ID "${id}" no encontrada.`);
    }
    return playe;
  }

  async updateEstado(id: string, estado: 'confirmado' | 'rechazado'): Promise<Playe> {
    const updatedPlaye = await this.playeModel.findByIdAndUpdate(id, { estado }, { new: true }).exec();
    if (!updatedPlaye) {
      throw new NotFoundException(`Reserva con ID "${id}" no encontrada.`);
    }
    return updatedPlaye;
  }

  update(id: string, updatePlayeDto: UpdatePlayeDto) {
    return this.playeModel.findByIdAndUpdate(id, updatePlayeDto, { new: true });
  }

  remove(id: string) {
    return this.playeModel.findByIdAndDelete(id);
  }

  async findReservasByUserId(userId: string): Promise<Playe[]> {
    if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('ID de usuario inválido.');
    }
    return this.playeModel.find({ user: userId })
      .populate({ path: 'enclosure', select: 'nombre admin', populate: { path: 'admin', select: 'name lastName email' } })
      .populate({ path: 'user', select: 'name lastName email' })
      .exec();
  }

  // ¡NUEVO MÉTODO! Para obtener reservas de los recintos de un administrador
  async findReservasByAdminId(adminId: string): Promise<Playe[]> {
    if (!Types.ObjectId.isValid(adminId)) {
      throw new BadRequestException('ID de administrador inválido.');
    }

    // SOLUCIÓN SIMPLE: En lugar de buscar por admin, buscar las reservas y filtrar por admin en el populate
    return this.playeModel.find({})
      .populate({ 
        path: 'enclosure', 
        select: 'nombre admin', 
        populate: { path: 'admin', select: 'name lastName email' },
        match: { admin: new Types.ObjectId(adminId) } // Filtrar por admin aquí
      })
      .populate({ path: 'user', select: 'name lastName email' })
      .exec()
      .then(reservas => reservas.filter(reserva => reserva.enclosure != null)); // Filtrar reservas donde enclosure no sea null
  }
}