import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Req, BadRequestException } from '@nestjs/common';
import { PlayesService } from './playes.service';
import { CreatePlayeDto } from './dto/create-playe.dto';
import { UpdatePlayeDto } from './dto/update-playe.dto';
import { EnclosureService } from '../enclosure/enclosure.service';
import { Types } from 'mongoose'; // <-- ¡IMPORTACIÓN NECESARIA AÑADIDA!

@Controller('playes')
export class PlayesController {
  constructor(
    private readonly playesService: PlayesService,
    private readonly enclosureService: EnclosureService,
  ) {}

  @Post()
  async create(@Body() createPlayeDto: CreatePlayeDto) {
    console.log('--- playes.controller.ts: Datos recibidos en createPlayeDto ---');
    console.log(createPlayeDto);
    console.log('-----------------------------------------------------------------');

    // Validación extra del ID antes de pasar a findOne
    if (!Types.ObjectId.isValid(createPlayeDto.enclosure)) { 
      throw new BadRequestException(`ID de recinto "${createPlayeDto.enclosure}" tiene un formato inválido.`);
    }

    console.log('--- PlayesController: Intentando buscar recinto con ID:', createPlayeDto.enclosure);
    const enclosure = await this.enclosureService.findOne(createPlayeDto.enclosure);
    console.log('--- PlayesController: Recinto encontrado por ID ---', enclosure); 
    
    if (!enclosure) {
      throw new NotFoundException(`Recinto con ID "${createPlayeDto.enclosure}" no encontrado.`);
    }

    const estadoFinal = enclosure.modoConfirmacion === 'automática' ? 'confirmado' : 'pendiente';

    const playeData = {
      ...createPlayeDto,
      estado: estadoFinal,
    };

    console.log('--- playes.controller.ts: Datos finales a enviar al servicio (playeData) ---');
    console.log(playeData);
    console.log('-------------------------------------------------------------------------');

    return this.playesService.create(playeData);
  }

  @Get('gestion/reservas')
  async getReservasPorPropietario() {
    return this.playesService.findAll();
  }

  @Patch('gestion/reservas/:id')
  async actualizarEstadoReserva(
    @Param('id') id: string,
    @Body('estado') estado: 'confirmado' | 'rechazado',
  ) {
    return this.playesService.updateEstado(id, estado);
  }

  @Get('user/:userId') 
  async findReservasByUser(@Param('userId') userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID de usuario inválido.');
    }
    return this.playesService.findReservasByUserId(userId);
  }

  @Get()
  findAll() {
    return this.playesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayeDto: UpdatePlayeDto) {
    return this.playesService.update(id, updatePlayeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playesService.remove(id);
  }
}