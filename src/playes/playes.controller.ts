import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayesService } from './playes.service';
import { CreatePlayeDto } from './dto/create-playe.dto';
import { UpdatePlayeDto } from './dto/update-playe.dto';

@Controller('playes')
export class PlayesController {
  constructor(private readonly playesService: PlayesService) {}

  @Post()
  create(@Body() createPlayeDto: CreatePlayeDto) {
    return this.playesService.create(createPlayeDto);
  }

  @Get()
  findAll() {
    return this.playesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayeDto: UpdatePlayeDto) {
    return this.playesService.update(+id, updatePlayeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playesService.remove(+id);
  }
}
