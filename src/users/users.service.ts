// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException, BadRequestException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './schemas/dto/create-user.dto';
import { UpdateUserDto } from './schemas/dto/update-user.dto';
import { AddPaymentMethodDto } from './schemas/dto/add-payment-method.dto'; // Importa el DTO

// Define the CreditCard type if not already imported
type CreditCard = {
  last4Digits: string;
  cardHolderName: string;
  expiryDate: string;
  type: string;
  addedAt: Date;
  // Add other fields as needed
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }


  async addPaymentMethod(addPaymentMethodDto: AddPaymentMethodDto): Promise<UserDocument> {
    const { userId, paymentMethod, paymentToken } = addPaymentMethodDto;

    // TODO: En un sistema real, aquí VALIDARÍAS el paymentToken con tu pasarela de pago.
    // Esto podría implicar una llamada API a Stripe, PayPal, etc.,
    // para confirmar que el token es válido y asociado a una tarjeta real.
    // Si la validación falla, lanzar una excepción.
    // Por ejemplo: await this.paymentGatewayService.validateToken(paymentToken);

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID de usuario inválido.');
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    // Crea una nueva instancia del subdocumento CreditCard
    const newCreditCard: CreditCard = {
      last4Digits: paymentMethod.last4Digits,
      cardHolderName: paymentMethod.cardHolderName,
      expiryDate: paymentMethod.expiryDate,
      type: paymentMethod.type,
      addedAt: new Date(), // Mongoose asignará esto por defecto si no lo pasamos, pero es explícito.
      // Aquí también guardarías cualquier ID de referencia de la pasarela de pago si lo necesitas,
      // pero NO el token de pago completo ni el CVV.
      // gatewayPaymentMethodId: 'pm_xxxxxxxxxxxx'
    };

    user.paymentMethods.push(newCreditCard); // Añade la nueva tarjeta al array
    await user.save(); // Guarda el documento del usuario con el nuevo método de pago

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Verificar si el email ya existe
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Crear el nuevo usuario
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Si hay una nueva contraseña, la hasheamos
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}
