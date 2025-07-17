import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  UseGuards,
  BadRequestException,
  Patch
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './schemas/dto/create-user.dto';
import { UpdateUserDto } from './schemas/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AddPaymentMethodDto } from './schemas/dto/add-payment-method.dto';
import { User, UserDocument } from './schemas/user.schema'; // <--- CORREGIDO: Ahora importa User y UserDocument
import { Types } from 'mongoose'; 
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo usuario.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'El usuario ha sido creado exitosamente.',
    type: User
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Ya existe un usuario con este correo electrónico.' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(createUserDto);
  }

  @Post(':userId/payment-methods') // POST a /users/{userId}/payment-methods
  @ApiOperation({ summary: 'Añadir un nuevo método de pago a un usuario.' })
  @ApiBody({ type: AddPaymentMethodDto }) // Define el tipo del cuerpo de la solicitud para Swagger
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Método de pago añadido exitosamente.',
    type: User // Usar la CLASE User para Swagger
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos o token de pago inválido.' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // Habilita la validación y transformación de DTOs
  async addPaymentMethod(
    @Param('userId') userId: string, // Obtener userId de la URL
    @Body() addPaymentMethodDto: AddPaymentMethodDto, // Obtener el resto de los datos del cuerpo
  ): Promise<UserDocument> {
    // Asegurarse de que el userId del parámetro coincida con el del cuerpo (si lo envías en ambos)
    // O simplemente usa el del parámetro si es el único lugar donde lo esperas
    if (addPaymentMethodDto.userId !== userId) {
      throw new BadRequestException('El ID de usuario en la URL no coincide con el del cuerpo de la solicitud.');
    }
    return this.usersService.addPaymentMethod(addPaymentMethodDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
